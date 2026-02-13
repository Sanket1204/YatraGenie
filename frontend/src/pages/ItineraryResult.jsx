import { useLocation } from "react-router-dom";
import ItineraryView from "../components/ItineraryView";
import { useRef } from "react";

// Note: requires `jspdf` and `html2canvas` packages. Install with:
// npm install jspdf html2canvas

export default function ItineraryResult() {
  const { state } = useLocation();
  const printRef = useRef();
  
  if (!state?.itinerary) {
    return <p className="text-center mt-10">No itinerary found.</p>;
  }

  return (
    <div className="max-w-5xl mx-auto px-4">
      <div ref={printRef} className="hero-card card-dark rounded-3xl p-6">
        <ItineraryView itinerary={state.itinerary} />
      </div>

      <div className="flex justify-end gap-3 mt-6">
        <button
          className="px-4 py-2 rounded-lg orange-btn"
          onClick={async () => {
            try {
              const { default: html2canvas } = await import('html2canvas');
              const { jsPDF } = await import('jspdf');
              const el = printRef.current;
              if (!el) return;

              // Create a sanitized clone to avoid unsupported CSS (e.g., oklch colors)
              const clone = el.cloneNode(true);
              const wrapper = document.createElement('div');
              wrapper.style.position = 'fixed';
              wrapper.style.left = '-9999px';
              wrapper.style.top = '0';
              wrapper.style.width = el.offsetWidth + 'px';
              wrapper.style.background = '#ffffff';
              wrapper.style.color = '#111111';
              wrapper.appendChild(clone);
              document.body.appendChild(wrapper);

              // Inline computed styles from the live DOM into the clone to avoid
              // advanced CSS functions (oklch) and unsupported features that
              // break html2canvas. We map each original node to its clone counterpart.
              const originals = el.querySelectorAll('*');
              const clones = clone.querySelectorAll('*');
              for (let i = 0; i < originals.length; i++) {
                const o = originals[i];
                const c = clones[i];
                try {
                  const cs = window.getComputedStyle(o);
                  // Apply the resolved computed CSS text where possible
                  if (cs && cs.cssText) {
                    c.style.cssText = cs.cssText;
                  } else {
                    // Fallback: copy common properties
                    c.style.font = cs.font;
                    c.style.color = cs.color;
                    c.style.background = cs.background;
                    c.style.backgroundColor = cs.backgroundColor;
                    c.style.border = cs.border;
                    c.style.padding = cs.padding;
                  }

                  // Now aggressively remove or neutralize properties html2canvas struggles with
                  c.style.boxShadow = 'none';
                  c.style.filter = 'none';
                  c.style.backdropFilter = 'none';
                  c.style.webkitBackdropFilter = 'none';
                  c.style.mixBlendMode = 'normal';
                  c.style.opacity = cs.opacity;
                  // Ensure text is visible on white background
                  c.style.color = c.style.color || '#111111';
                  c.style.backgroundColor = c.style.backgroundColor || '#ffffff';
                } catch (err) {
                  // ignore nodes that throw while reading computed styles
                }
              }

              const canvas = await html2canvas(wrapper, { scale: 2, backgroundColor: '#ffffff', useCORS: true });
              const imgData = canvas.toDataURL('image/png');
              const pdf = new jsPDF('p', 'mm', 'a4');
              const imgProps = pdf.getImageProperties(imgData);
              const pdfWidth = pdf.internal.pageSize.getWidth();
              const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
              pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
              pdf.save('itinerary.pdf');

              // cleanup
              document.body.removeChild(wrapper);
            } catch (err) {
              console.error('PDF generation error', err);
              alert('PDF generation failed — try installing jspdf and html2canvas, and avoid advanced CSS color functions (oklch).');
            }
          }}
        >
          Download PDF
        </button>
      </div>
    </div>
  );
}
