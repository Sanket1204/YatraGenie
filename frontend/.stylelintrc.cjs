module.exports = {
  rules: {
    // Allow Tailwind at-rules so editor/stylelint doesn't flag them as unknown
    "at-rule-no-unknown": [
      true,
      {
        "ignoreAtRules": [
          "tailwind",
          "apply",
          "variants",
          "responsive",
          "screen"
        ]
      }
    ]
  }
}
