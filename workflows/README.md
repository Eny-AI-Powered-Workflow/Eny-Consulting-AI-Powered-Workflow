<!-- /home/obed/Documents/Eny_consulting/workflows/README.md -->
# n8n Workflows

Export every workflow's JSON into this folder and commit it -- n8n workflows
built only in the UI are invisible to git and to whoever picks this up after you.

| Workflow file | Webhook path | Called by |
|---|---|---|
| lead-scorer.json | /webhook/lead-scorer | POST /api/v1/agents/trigger/lead-scorer |
| ceo-briefing.json | /webhook/ceo-briefing | Cron (n8n-native, 7am daily) |

Naming convention matches the brief's registry: ENY-[DEPT]-[FUNCTION].
