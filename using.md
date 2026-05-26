---
layout: doc
title: Install the Skill
description: Add the Skill Patterns Skill and let your AI apply the right patterns as you build.
permalink: /using/
---

# Install the Skill

Most people build a Skill *with* an AI — so the fastest way to use these patterns is to install the Skill and let the AI apply them for you. Prefer to place patterns by hand? See [Manual usage]({{ '/manual/' | relative_url }}).

## Get the Skill

Using a Skill makes pattern selection a breeze. Grab it and add it to your Skill-creation workflow.

```
npx skills add borkweb/skill-patterns --skill skill-patterns
```

In **Claude Code**, you can install it as a plugin instead — add the marketplace, then install the plugin:

```
/plugin marketplace add borkweb/skill-patterns
/plugin install skill-patterns@skill-patterns
```

## Build with AI

### Using the Skill

The easiest way to select patterns is using the Skill, which will apply the right patterns automatically whenever you build a Skill.

**Example prompt to create a Skill:**

> Create a Skill with /skill-creator and /skill-patterns that accepts an article URL, helps me craft my own narrative, then creates an X post and/or a LinkedIn post.

### Pointing your agent at the catalog

If you don't want to use the Skill, but you still want your agent to auto-select patterns for you, you can point the agent at the catalog: [`/llms.txt`]({{ '/llms.txt' | relative_url }}) or [`/patterns.json`]({{ '/patterns.json' | relative_url }}) — and ask it to apply the patterns your skill's purpose calls for. It selects and weaves them in, then shows you what it chose so you can adjust.

[Browse the patterns →]({{ '/patterns/' | relative_url }}) · [Place patterns by hand →]({{ '/manual/' | relative_url }})
