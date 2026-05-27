---
title: "Schema-locked output"
slug: schema-locked-output
icon: "fa-solid fa-code"
category: output
summary: "Forces output into a strict, validated structure and repairs or rejects anything that doesn't conform."
adds:
  - "Emits output that matches a defined schema or field set exactly"
  - "Validates against the schema before returning, and repairs what doesn't fit"
  - "Fails loudly when the content can't be made to conform, instead of bending the format"
prompt: |
  Return [output] strictly as [schema / field set / JSON shape]: [fields and their types]. Include every required field, use exactly these names, and add nothing outside the schema. Before returning, validate against it — if something doesn't conform, fix it. If the content genuinely can't fit the schema, say so explicitly rather than bending the format or inventing fields.
---
