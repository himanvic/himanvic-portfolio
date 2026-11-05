# Security Policy

## Reporting Security Issues

Security and privacy are taken seriously in this project. If you discover a vulnerability or security flaw, please report it privately:

- **Email**: [hkg77177@gmail.com](mailto:hkg77177@gmail.com)
- **Response Time**: Usually within 24–48 hours.

Please do not open public GitHub issues for security vulnerabilities until they have been reviewed and mitigated.

## Security Controls Implemented

1. **Strict Content Security Policy (CSP)**: Disallows arbitrary inline script evaluation, untrusted origins, and unauthorized external framing.
2. **Reverse Tabnabbing Protection**: All outbound links use `rel="noopener noreferrer"` and `window.open(url, "_blank", "noopener,noreferrer")`.
3. **Hardware Privacy Protection**: Permissions-Policy explicitly blocks camera, microphone, geolocation, payment, USB, and motion sensors.
4. **Transport Encryption**: Strict-Transport-Security (HSTS) with preload enabled.
5. **No Dangerous Sinks**: Zero usage of `dangerouslySetInnerHTML`, `eval()`, `document.write()`, or `innerHTML`.
