# Terraform and CD Pipeline HLD

This diagram shows the current CI/CD behavior:
- Pull requests and branch pushes run tests, docker build, and Terraform plan.
- Main branch pushes run tests, docker build, ACR push, then Terraform apply.
- Terraform runs non-interactively in both plan and apply modes.

```mermaid
flowchart TD
    A[GitHub Event] --> B{Event Type}

    B -->|pull_request| C[Test]
    B -->|push non-main| C
    B -->|push main| C

    C --> D[Docker Build]

    D --> E{Branch / Event Conditions}

    E -->|PR or push non-main| F[Terraform Plan Job]
    E -->|push main| G[Push Image to ACR]

    G --> H[Terraform Apply Job]

    subgraph Terraform Script
      I[Load TF_ENVIRONMENT dev/test/prod]
      J[Select backend file]
      K[terraform init input=false reconfigure]
      L[terraform validate]
      M{GITHUB_REF is main?}
      N[terraform apply input=false auto-approve]
      O[terraform plan input=false]
      I --> J --> K --> L --> M
      M -->|yes| N
      M -->|no| O
    end

    F --> I
    H --> I
```

## Save as Image in VS Code

1. Open this file in the editor.
2. Open Markdown Preview.
3. Use your Markdown preview export option or screenshot tool to save as PNG.

If your current setup does not show a direct export option, install a Markdown PDF extension and export this file to PDF/PNG from VS Code.
