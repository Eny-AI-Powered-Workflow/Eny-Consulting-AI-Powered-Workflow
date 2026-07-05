# /home/obed/Documents/Eny_consulting/backend/app/services/claude_service.py
from anthropic import Anthropic

from app.core.config import settings

_client = Anthropic(api_key=settings.ANTHROPIC_API_KEY)


def generate(prompt: str, role_context: str = "") -> str:
    """Runs a Claude completion scoped to the caller's role context.
    `role_context` should be the retrieval slice (SOPs/brand voice/course
    content) filtered to the user's department -- this is what makes agent
    output "personalized per role" instead of generic.
    """
    system = (
        "You are an ENY Consulting internal AI agent. Only use the context "
        "provided below; do not answer outside the caller's department scope.\n\n"
        f"CONTEXT:\n{role_context}"
    )
    message = _client.messages.create(
        model=settings.CLAUDE_MODEL,
        max_tokens=1024,
        system=system,
        messages=[{"role": "user", "content": prompt}],
    )
    return message.content[0].text
