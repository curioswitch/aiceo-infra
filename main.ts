import { App } from "cdktf";
import { AiCeoStack } from "./stacks/aiceo/index.js";
import { SysadminStack } from "./stacks/sysadmin/index.js";

const app = new App();

new SysadminStack(app);

new AiCeoStack(app, {
  environment: "dev",
  project: "aiceo-dev",
  domain: "alpha.aiceo.curioswitch.org",
  googleAuthClientId:
    "285404307541-fbsps21hso6dk97f0005kfeqc621l9f5.apps.googleusercontent.com",
  googleAuthClientSecretCiphertext:
    "CiQACMFBERhcq60AZ3kGTo3bl/iSDcc95SNZWy2bzSmBUXxP3EISTACcjleORc0NsT6esPW9Hq0jMOvIlWn9ScruEYc+WH2Pz8gGPoECDFtynd/YgI7M+Vv7qN7pGJ0MPnukQLT0OnNkXqrnD6HmjrVkpTg=",
});

new AiCeoStack(app, {
  environment: "prod",
  project: "aiceo-prod",
  domain: "aiceo.curioswitch.org",
  googleAuthClientId:
    "1004160178879-qpe8vc1cc6r5fldn7msmtlbpj1iugcri.apps.googleusercontent.com",
  googleAuthClientSecretCiphertext:
    "CiQAYLUfkqt3vwwQW5CPcU3CQTprFWbWM6/cueL18qWgRSbJf80STAAJDYpSMQzZGzf7zqT150v1OHMEOqo061aVWMUHFZ9SlAiGuG21QB7aDO6bzQp+BIYZGzRBnu4zgS1dZDar7+ENWKAuEKhZsXOlNi0=",
});

app.synth();
