// Define Workflows and Tasks
const WORKFLOWS = [
  {
    id: "sales",
    label: "Sales",
    icon: "ti-trending-up",
    color: "#4F46E5",
    bg: "rgba(79, 70, 229, 0.12)",
    tasks: [
      { id: "lead_qualify", label: "Qualify a Lead", prompt: "Qualify this lead and score them 1-10 based on fit, urgency, and budget potential. Provide a brief rationale and suggested next steps." },
      { id: "email_followup", label: "Write Follow-up Email", prompt: "Write a concise, personalized follow-up sales email. Keep it under 120 words, outcome-focused, and end with a single clear call to action." },
      { id: "objection", label: "Handle an Objection", prompt: "Provide a professional, empathetic response to this sales objection. Use the feel-felt-found framework and steer back to value." },
      { id: "proposal", label: "Draft Proposal Outline", prompt: "Create a structured sales proposal outline with: executive summary, problem statement, proposed solution, ROI/value, pricing placeholder, and next steps." },
    ]
  },
  {
    id: "hr",
    label: "HR",
    icon: "ti-users",
    color: "#0891B2",
    bg: "rgba(8, 145, 178, 0.12)",
    tasks: [
      { id: "job_desc", label: "Write Job Description", prompt: "Write a compelling, inclusive job description. Include: role summary, 5 key responsibilities, 5 must-have qualifications, 3 nice-to-haves, and a brief culture note. Avoid jargon and biased language." },
      { id: "interview_qs", label: "Generate Interview Questions", prompt: "Generate 8 structured behavioral interview questions for this role. Mix competency-based, situational, and culture-fit questions. Include what to listen for in each answer." },
      { id: "performance_review", label: "Draft Performance Review", prompt: "Draft a balanced, constructive performance review. Highlight strengths, identify 2 development areas, and set 3 SMART goals for the next review period." },
      { id: "onboarding", label: "Create Onboarding Plan", prompt: "Create a 30-60-90 day onboarding plan for a new hire. Include milestones, key people to meet, resources to review, and success metrics for each phase." },
    ]
  },
  {
    id: "project",
    label: "Projects",
    icon: "ti-layout-kanban",
    color: "#7C3AED",
    bg: "rgba(124, 58, 237, 0.12)",
    tasks: [
      { id: "project_brief", label: "Write Project Brief", prompt: "Write a concise project brief covering: objective, scope, stakeholders, key deliverables, timeline estimate, risks, and definition of done." },
      { id: "standup", label: "Summarize Standup Notes", prompt: "Convert these raw standup notes into a clean, structured summary with: what was completed, what's in progress, blockers, and any decisions needed." },
      { id: "risk_register", label: "Build Risk Register", prompt: "Create a risk register table with 6 potential project risks. For each: describe the risk, likelihood (H/M/L), impact (H/M/L), mitigation strategy, and owner placeholder." },
      { id: "retrospective", label: "Facilitate Retrospective", prompt: "Analyze this project feedback and produce a retrospective summary with: what went well (top 3), what to improve (top 3), and 3 concrete action items with owners." },
    ]
  },
  {
    id: "finance",
    label: "Finance",
    icon: "ti-coin",
    color: "#059669",
    bg: "rgba(5, 150, 105, 0.12)",
    tasks: [
      { id: "budget_review", label: "Analyze Budget Variance", prompt: "Analyze this budget vs actuals data. Identify significant variances (>10%), explain likely causes, and recommend 3 corrective actions." },
      { id: "expense_policy", label: "Draft Expense Policy", prompt: "Draft a clear, fair company expense policy covering: travel, meals, equipment, and entertainment. Include approval thresholds, reimbursement timelines, and prohibited expenses." },
      { id: "invoice_email", label: "Write Invoice Follow-up", prompt: "Write a professional, firm but polite payment reminder email for an overdue invoice. Include escalation language appropriate for 30+ days overdue." },
      { id: "forecast", label: "Build Forecast Narrative", prompt: "Write a CFO-ready narrative for a quarterly financial forecast. Cover revenue trends, cost drivers, key assumptions, risks to the outlook, and recommended management actions." },
    ]
  },
  {
    id: "ops",
    label: "Operations",
    icon: "ti-settings",
    color: "#D97706",
    bg: "rgba(217, 119, 6, 0.12)",
    tasks: [
      { id: "sop", label: "Write SOP", prompt: "Write a clear Standard Operating Procedure (SOP) for this process. Include: purpose, scope, roles, step-by-step instructions, quality checks, and what to do when things go wrong." },
      { id: "vendor_eval", label: "Evaluate Vendor Options", prompt: "Create a vendor evaluation scorecard for 3 hypothetical vendors. Score on: pricing, reliability, support, integration, and scalability. Provide a recommendation with rationale." },
      { id: "incident_report", label: "Draft Incident Report", prompt: "Write a professional incident report covering: timeline of events, root cause analysis, immediate response actions, impact assessment, and preventive measures going forward." },
      { id: "kpi_dashboard", label: "Define KPI Framework", prompt: "Define a KPI framework for this operational area. Suggest 6 KPIs with: metric name, formula, target, measurement frequency, and the business question each answers." },
    ]
  },
  {
    id: "support",
    label: "Support",
    icon: "ti-headset",
    color: "#DC2626",
    bg: "rgba(220, 38, 38, 0.12)",
    tasks: [
      { id: "ticket_response", label: "Respond to Support Ticket", prompt: "Write a professional, empathetic support response to this customer issue. Acknowledge the problem, provide a solution or next steps, and close with a confidence-building statement." },
      { id: "faq", label: "Create FAQ Entries", prompt: "Turn this support conversation into 3 polished FAQ entries. Each should have a clear question (from the customer's perspective) and a concise, helpful answer under 80 words." },
      { id: "escalation", label: "Write Escalation Summary", prompt: "Write an internal escalation summary for a senior support agent. Include: customer impact, issue description, steps already taken, what's needed, and urgency level with justification." },
      { id: "csat_analysis", label: "Analyze CSAT Feedback", prompt: "Analyze this customer satisfaction feedback. Identify top 3 positive themes, top 3 pain points, sentiment trend, and provide 3 specific recommendations to improve scores." },
    ]
  }
];

const MODELS = {
  gemini: [
    { value: "gemini-2.5-flash", label: "Gemini 2.5 Flash (Fast, Efficient)" },
    { value: "gemini-2.5-pro", label: "Gemini 2.5 Pro (Analytical, Complex Tasks)" }
  ],
  anthropic: [
    { value: "claude-3-5-sonnet-20241022", label: "Claude 3.5 Sonnet (State of the Art)" },
    { value: "claude-3-haiku-20240307", label: "Claude 3 Haiku (Lightweight, Fast)" }
  ]
};

// Application State
let activeWorkflow = WORKFLOWS[0];
let activeTask = WORKFLOWS[0].tasks[0];
let chatHistory = []; // { role: 'user'|'assistant', content: string }
let isLoading = false;

// DOM Elements
const workflowTabs = document.getElementById("workflow-tabs");
const taskGrid = document.getElementById("task-grid");
const chatHeaderBar = document.getElementById("chat-header-bar");
const activeTaskBadge = document.getElementById("active-task-badge");
const activeTaskTitle = document.getElementById("active-task-title");
const activeTaskPrompt = document.getElementById("active-task-prompt");
const chatMessagesContainer = document.getElementById("chat-messages-container");
const welcomeScreen = document.getElementById("welcome-screen");
const welcomeIconWrapper = document.getElementById("welcome-icon-wrapper");
const userInput = document.getElementById("user-input");
const btnRun = document.getElementById("btn-run");
const btnClear = document.getElementById("btn-clear");
const statusBadge = document.getElementById("status-badge");

// Settings Modal Elements
const btnSettings = document.getElementById("btn-settings");
const settingsModal = document.getElementById("settings-modal");
const btnCloseSettings = document.getElementById("btn-close-settings");
const providerSelect = document.getElementById("provider-select");
const lblApiKey = document.getElementById("lbl-api-key");
const apiKeyInput = document.getElementById("api-key-input");
const btnToggleKeyVisibility = document.getElementById("btn-toggle-key-visibility");
const modelSelect = document.getElementById("model-select");
const btnResetSettings = document.getElementById("btn-reset-settings");
const btnSaveSettings = document.getElementById("btn-save-settings");

// Initial Setup
function init() {
  // Load configuration
  loadSettings();
  
  // Render departments
  renderWorkflowTabs();
  
  // Set initial active state
  setWorkflow(activeWorkflow);
  
  // Add global event listeners
  setupEventListeners();
}

// Load configurations from Local Storage
function loadSettings() {
  const provider = localStorage.getItem("bizflow_provider") || "gemini";
  const apiKey = localStorage.getItem("bizflow_api_key") || "";
  const model = localStorage.getItem("bizflow_model");
  
  providerSelect.value = provider;
  apiKeyInput.value = apiKey;
  
  updateModelOptions(provider);
  if (model) {
    modelSelect.value = model;
  }
  
  updateStatusBadge();
}

// Update model dropdown options
function updateModelOptions(provider) {
  modelSelect.innerHTML = "";
  const options = MODELS[provider] || [];
  options.forEach(opt => {
    const el = document.createElement("option");
    el.value = opt.value;
    el.textContent = opt.label;
    modelSelect.appendChild(el);
  });
}

// Update settings connectivity display
function updateStatusBadge() {
  const key = apiKeyInput.value.trim();
  if (key) {
    statusBadge.className = "status-badge status-online";
    statusBadge.querySelector(".status-text").textContent = "API Keys Set";
  } else {
    statusBadge.className = "status-badge status-offline";
    statusBadge.querySelector(".status-text").textContent = "Keys Required";
  }
}

// Set active department/workflow
function setWorkflow(wf) {
  activeWorkflow = wf;
  
  // Update accent styling dynamically
  document.documentElement.style.setProperty('--accent-color', wf.color);
  document.documentElement.style.setProperty('--accent-bg', wf.bg);
  document.documentElement.style.setProperty('--accent-glow', wf.color + '55'); // 33% transparency
  
  // Redraw tabs to reflect active
  document.querySelectorAll(".wf-tab-btn").forEach(btn => {
    if (btn.dataset.id === wf.id) {
      btn.classList.add("active");
    } else {
      btn.classList.remove("active");
    }
  });

  // Render tasks for this workflow
  renderTasks();
  
  // Select first task
  setTask(wf.tasks[0]);
}

// Set active task
function setTask(task) {
  activeTask = task;
  
  // Update active classes on cards
  document.querySelectorAll(".task-card").forEach(card => {
    if (card.dataset.id === task.id) {
      card.classList.add("active");
    } else {
      card.classList.remove("active");
    }
  });
  
  // Update Header details
  activeTaskBadge.textContent = activeWorkflow.label;
  activeTaskBadge.style.color = activeWorkflow.color;
  activeTaskBadge.style.backgroundColor = activeWorkflow.bg;
  
  activeTaskTitle.textContent = task.label;
  activeTaskPrompt.textContent = task.prompt;
  
  // Reset chat logic for new task
  clearChat();
  userInput.placeholder = `Describe your ${task.label.toLowerCase()} situation... (Ctrl+Enter)`;
}

// Render tabs in the sidebar
function renderWorkflowTabs() {
  workflowTabs.innerHTML = "";
  WORKFLOWS.forEach(wf => {
    const btn = document.createElement("button");
    btn.className = "wf-tab-btn";
    btn.dataset.id = wf.id;
    // Set custom HSL properties for hover/active transitions
    btn.style.setProperty('--wf-color', wf.color);
    btn.style.setProperty('--wf-bg', wf.bg);
    
    btn.innerHTML = `
      <div class="tab-left">
        <i class="ti ${wf.icon}" style="color: ${wf.color}"></i>
        <span>${wf.label}</span>
      </div>
      <span class="badge-count">${wf.tasks.length}</span>
    `;
    
    btn.addEventListener("click", () => setWorkflow(wf));
    workflowTabs.appendChild(btn);
  });
}

// Render cards in the task selector
function renderTasks() {
  taskGrid.innerHTML = "";
  activeWorkflow.tasks.forEach(task => {
    const card = document.createElement("button");
    card.className = "task-card";
    card.dataset.id = task.id;
    card.textContent = task.label;
    
    card.addEventListener("click", () => setTask(task));
    taskGrid.appendChild(card);
  });
}

// Redraw chat log
function renderMessages() {
  // Clear chat except welcome screen (unless we have messages)
  if (chatHistory.length === 0) {
    welcomeScreen.style.display = "flex";
    // Clean old bubbles
    const bubbles = chatMessagesContainer.querySelectorAll(".msg-row, .error-bubble, .loading-indicator");
    bubbles.forEach(b => b.remove());
    btnClear.style.display = "none";
    welcomeIconWrapper.style.color = activeWorkflow.color;
    welcomeIconWrapper.style.backgroundColor = activeWorkflow.bg;
    return;
  }
  
  welcomeScreen.style.display = "none";
  btnClear.style.display = "inline-flex";
  
  // Remove existing dynamically drawn elements
  const currentItems = chatMessagesContainer.querySelectorAll(".msg-row, .error-bubble, .loading-indicator");
  currentItems.forEach(i => i.remove());
  
  chatHistory.forEach(msg => {
    const row = document.createElement("div");
    row.className = `msg-row ${msg.role}`;
    
    const bubble = document.createElement("div");
    bubble.className = "msg-bubble";
    
    // Quick, clean Markdown renderer for bullet/numbered lists & paragraphs
    bubble.innerHTML = formatMarkdown(msg.content);
    
    const sender = document.createElement("span");
    sender.className = "msg-sender";
    sender.textContent = msg.role === "user" ? "You" : "Agent";
    
    row.appendChild(bubble);
    row.appendChild(sender);
    chatMessagesContainer.appendChild(row);
  });
  
  // Scroll to bottom
  chatMessagesContainer.scrollTop = chatMessagesContainer.scrollHeight;
}

// Simple Helper for basic markdown parsing
function formatMarkdown(text) {
  if (!text) return "";
  
  // HTML escape to prevent injection
  let html = text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
  
  // Process bullet items first
  let lines = html.split("\n");
  let inList = false;
  let formattedLines = [];
  
  for (let line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith("* ") || trimmed.startsWith("- ")) {
      if (!inList) {
        formattedLines.push("<ul>");
        inList = true;
      }
      formattedLines.push(`<li>${trimmed.substring(2)}</li>`);
    } else {
      if (inList) {
        formattedLines.push("</ul>");
        inList = false;
      }
      if (trimmed.length > 0) {
        formattedLines.push(`<p>${line}</p>`);
      }
    }
  }
  if (inList) {
    formattedLines.push("</ul>");
  }
  
  return formattedLines.join("");
}

// Execute active AI prompt
async function runAgent() {
  const inputVal = userInput.value.trim();
  if (!inputVal || isLoading) return;
  
  // Clear any existing error logs
  const oldErrors = chatMessagesContainer.querySelectorAll(".error-bubble");
  oldErrors.forEach(e => e.remove());
  
  // Retrieve keys and options
  const apiKey = localStorage.getItem("bizflow_api_key") || "";
  const provider = localStorage.getItem("bizflow_provider") || "gemini";
  const model = localStorage.getItem("bizflow_model") || (provider === "gemini" ? "gemini-2.5-flash" : "claude-3-5-sonnet-20241022");
  
  // Prepare chat histories
  chatHistory.push({ role: "user", content: inputVal });
  renderMessages();
  
  // Clear text entry
  userInput.value = "";
  
  // Prepare system prompt for model
  const systemPrompt = `You are a sharp, experienced business operations assistant. ${activeTask.prompt} Be direct, practical, and structured. Use bullet points or numbered lists where appropriate. Do not pad responses with disclaimers or unnecessary caveats.`;
  
  // Show loading indicator
  showLoading(true);
  
  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        api_key: apiKey,
        provider: provider,
        model: model,
        system_prompt: systemPrompt,
        messages: chatHistory
      })
    });
    
    const contentType = response.headers.get("content-type");
    let data;
    if (contentType && contentType.includes("application/json")) {
      data = await response.json();
    } else {
      throw new Error("Received a non-JSON (likely HTML) response from the server.");
    }
    
    showLoading(false);
    
    if (!response.ok || data.error) {
      throw new Error(data.message || data.error || "An unknown error occurred while calling the agent server.");
    }
    
    chatHistory.push({ role: "assistant", content: data.reply });
    renderMessages();
    
  } catch (err) {
    showLoading(false);
    
    let friendlyMessage = err.message;
    if (window.location.protocol === "file:") {
      friendlyMessage = "You opened index.html directly from your local files. To run the app, you must start the Python backend (run_app.bat or 'python ai_business_agent.py') and access it at http://127.0.0.1:8000";
    } else if (window.location.hostname.endsWith("github.io")) {
      friendlyMessage = "GitHub Pages only hosts static files and cannot run the Python backend. To run Bizflow AI, either run it locally using Python, or deploy the backend to a service like Render or Railway and update the API endpoint URL.";
    } else if (err.message.includes("Unexpected token '<'") || err.message.includes("non-JSON")) {
      friendlyMessage = "The server returned HTML instead of JSON. Ensure the FastAPI backend server is running and that you are visiting http://127.0.0.1:8000 (not a separate static development server).";
    }
    
    showError(friendlyMessage);
  }
}

// Toggle Typing Loader
function showLoading(show) {
  isLoading = show;
  btnRun.disabled = show;
  userInput.disabled = show;
  
  // Remove existing loader
  const oldLoader = chatMessagesContainer.querySelector(".loading-indicator");
  if (oldLoader) oldLoader.remove();
  
  if (show) {
    welcomeScreen.style.display = "none";
    
    const loader = document.createElement("div");
    loader.className = "loading-indicator";
    loader.innerHTML = `
      <div class="bounce-dots">
        <span></span>
        <span></span>
        <span></span>
      </div>
      Working on it...
    `;
    chatMessagesContainer.appendChild(loader);
    chatMessagesContainer.scrollTop = chatMessagesContainer.scrollHeight;
  }
}

// Display error log in chat
function showError(msg) {
  // Remove existing error
  const oldError = chatMessagesContainer.querySelector(".error-bubble");
  if (oldError) oldError.remove();
  
  const errDiv = document.createElement("div");
  errDiv.className = "error-bubble";
  errDiv.innerHTML = `<i class="ti ti-alert-triangle"></i> <span>${msg}</span>`;
  chatMessagesContainer.appendChild(errDiv);
  chatMessagesContainer.scrollTop = chatMessagesContainer.scrollHeight;
}

// Reset history
function clearChat() {
  chatHistory = [];
  renderMessages();
}

// Set up UI Event listeners
function setupEventListeners() {
  // Run button
  btnRun.addEventListener("click", runAgent);
  
  // Clear button
  btnClear.addEventListener("click", clearChat);
  
  // Keyboard Shortcut: Ctrl/Cmd + Enter
  userInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      runAgent();
    }
  });
  
  // Settings modal open/close
  btnSettings.addEventListener("click", () => {
    settingsModal.style.display = "flex";
  });
  
  const closeModal = () => {
    settingsModal.style.display = "none";
  };
  btnCloseSettings.addEventListener("click", closeModal);
  
  // Close modal when clicking outside contents
  settingsModal.addEventListener("click", (e) => {
    if (e.target === settingsModal) {
      closeModal();
    }
  });
  
  // Change provider dropdown updates key inputs and models
  providerSelect.addEventListener("change", (e) => {
    const prov = e.target.value;
    lblApiKey.textContent = prov === "gemini" ? "Gemini API Key" : "Claude API Key";
    updateModelOptions(prov);
  });
  
  // Toggle password visibility
  btnToggleKeyVisibility.addEventListener("click", () => {
    const type = apiKeyInput.type === "password" ? "text" : "password";
    apiKeyInput.type = type;
    const icon = btnToggleKeyVisibility.querySelector("i");
    if (type === "password") {
      icon.className = "ti ti-eye";
    } else {
      icon.className = "ti ti-eye-off";
    }
  });
  
  // Reset credentials
  btnResetSettings.addEventListener("click", () => {
    apiKeyInput.value = "";
    localStorage.removeItem("bizflow_api_key");
    localStorage.removeItem("bizflow_provider");
    localStorage.removeItem("bizflow_model");
    
    updateStatusBadge();
    closeModal();
  });
  
  // Save credentials
  btnSaveSettings.addEventListener("click", () => {
    const key = apiKeyInput.value.trim();
    const prov = providerSelect.value;
    const mod = modelSelect.value;
    
    localStorage.setItem("bizflow_api_key", key);
    localStorage.setItem("bizflow_provider", prov);
    localStorage.setItem("bizflow_model", mod);
    
    updateStatusBadge();
    closeModal();
  });
}

// Start
document.addEventListener("DOMContentLoaded", init);
