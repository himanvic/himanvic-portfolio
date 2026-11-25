# Security Policy

## Reporting Security Issues

Security and privacy are taken seriously in this project. If you discover a vulnerability or security flaw, please report it privately via GitHub Security Advisories:

- **Private Advisory**: [Open a Private Security Advisory](https://github.com/himanvic/himanvic-portfolio/security/advisories/new)
- **Response Time**: Usually within 24–48 hours.

Please do not open public GitHub issues for security vulnerabilities until they have been reviewed and mitigated.

## Security Controls Implemented

1. **Strict Edge Security Headers**: `default-src 'none'` CSP allowlist, HSTS preload, `X-Frame-Options: DENY`, `nosniff`, and COOP/CORP isolation delivered purely via HTTP edge headers (`public/_headers`).
2. **Subresource Integrity (SRI)**: Production bundles emit `sha384` integrity hashes across module scripts and stylesheets.
3. **Reverse Tabnabbing & URL Poisoning Prevention**: Outbound links use `rel="noopener noreferrer"` and strict `https:` URL validation.
4. **Hardware Privacy Protection**: `Permissions-Policy` explicitly blocks camera, microphone, geolocation, payment, USB, and motion sensors.
5. **No Dangerous Sinks**: Zero usage of `dangerouslySetInnerHTML`, `eval()`, `document.write()`, or `innerHTML`; strict runtime sanitization and `Object.freeze` on configuration data.
