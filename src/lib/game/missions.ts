export type MissionType =
  | "quiz"
  | "code"
  | "bug-hunt"
  | "gradient"
  | "order"
  | "token";

export type TrackId =
  | "foundation"
  | "supervised"
  | "neural"
  | "attention"
  | "finetune"
  | "deploy";

export interface Track {
  id: TrackId;
  name: string;
  codename: string;
  blurb: string;
  icon: string;
}

export interface QuizMission {
  type: "quiz";
  question: string;
  choices: string[];
  correctIndex: number;
  explain: string;
}

export interface CodeMission {
  type: "code";
  prompt: string;
  template: string;
  blanks: { id: string; answer: string; hint: string }[];
  explain: string;
}

export interface BugHuntMission {
  type: "bug-hunt";
  prompt: string;
  lines: string[];
  bugLine: number;
  explain: string;
}

export interface GradientMission {
  type: "gradient";
  prompt: string;
  targetW: number;
  targetB: number;
  tolerance: number;
  explain: string;
}

export interface OrderMission {
  type: "order";
  prompt: string;
  items: string[];
  correctOrder: number[];
  explain: string;
}

export interface TokenMission {
  type: "token";
  prompt: string;
  context: string;
  choices: string[];
  correctIndex: number;
  explain: string;
}

export type MissionPayload =
  | QuizMission
  | CodeMission
  | BugHuntMission
  | GradientMission
  | OrderMission
  | TokenMission;

export interface Mission {
  id: string;
  track: TrackId;
  title: string;
  intel: string;
  xp: number;
  unlockAfter?: string[];
  payload: MissionPayload;
}

export const TRACKS: Track[] = [
  {
    id: "foundation",
    name: "Foundation Protocol",
    codename: "PYTHON",
    blurb: "Syntax, structures, and the first lines of machine code.",
    icon: "01",
  },
  {
    id: "supervised",
    name: "Supervised Ops",
    codename: "REGRESSION",
    blurb: "Linear models, cost functions, gradient descent.",
    icon: "02",
  },
  {
    id: "neural",
    name: "Neural Lattice",
    codename: "NETWORKS",
    blurb: "Layers, activations, forward pass intuition.",
    icon: "03",
  },
  {
    id: "attention",
    name: "Attention Array",
    codename: "TRANSFORMERS",
    blurb: "Tokens, attention, and building GPT instincts.",
    icon: "04",
  },
  {
    id: "finetune",
    name: "Fine-Tune Chamber",
    codename: "LORA",
    blurb: "Adapters, LoRA, and efficient adaptation.",
    icon: "05",
  },
  {
    id: "deploy",
    name: "Deploy Grid",
    codename: "SHIP",
    blurb: "Hugging Face, demos, and recruit-ready proof.",
    icon: "06",
  },
];

export const MISSIONS: Mission[] = [
  // ── Foundation ──
  {
    id: "f1-variables",
    track: "foundation",
    title: "Signal Assignment",
    intel: "Variables store values. Names point to data.",
    xp: 40,
    payload: {
      type: "quiz",
      question: "In Python, which line correctly assigns the integer 42 to a variable named signal?",
      choices: [
        "signal := 42",
        "signal = 42",
        "int signal = 42",
        "let signal = 42",
      ],
      correctIndex: 1,
      explain:
        "Python uses = for assignment. No type keyword is required for a simple binding.",
    },
  },
  {
    id: "f2-list",
    track: "foundation",
    title: "Array Buffer",
    intel: "Lists are ordered, mutable sequences.",
    xp: 50,
    unlockAfter: ["f1-variables"],
    payload: {
      type: "code",
      prompt: "Complete the code to create a list of three learning rates and print the second one.",
      template: `rates = [__A__, 0.01, 0.001]
print(rates[__B__])`,
      blanks: [
        { id: "A", answer: "0.1", hint: "first learning rate as a float" },
        { id: "B", answer: "1", hint: "zero-based index for second item" },
      ],
      explain: "Python lists are zero-indexed. rates[1] is the second element (0.01).",
    },
  },
  {
    id: "f3-bug",
    track: "foundation",
    title: "Syntax Breach",
    intel: "Find the line that will crash the interpreter.",
    xp: 55,
    unlockAfter: ["f2-list"],
    payload: {
      type: "bug-hunt",
      prompt: "Identify the broken line in this mini training loop.",
      lines: [
        "loss_history = []",
        "for epoch in range(10)",
        "    loss = 1.0 / (epoch + 1)",
        "    loss_history.append(loss)",
        "print(loss_history[-1])",
      ],
      bugLine: 1,
      explain:
        "A for-loop header must end with a colon: for epoch in range(10):",
    },
  },
  {
    id: "f4-fn",
    track: "foundation",
    title: "Function Core",
    intel: "Functions package reusable logic.",
    xp: 50,
    unlockAfter: ["f3-bug"],
    payload: {
      type: "quiz",
      question: "What does this function return for predict(2, 3, 1)?\n\ndef predict(x, w, b):\n    return w * x + b",
      choices: ["5", "6", "7", "8"],
      correctIndex: 2,
      explain: "w*x + b = 3*2 + 1 = 7. This is the linear model prediction equation.",
    },
  },

  // ── Supervised ──
  {
    id: "s1-model",
    track: "supervised",
    title: "Model Representation",
    intel: "f_w,b(x) = wx + b is the atomic supervised unit.",
    xp: 60,
    unlockAfter: ["f4-fn"],
    payload: {
      type: "quiz",
      question: "In linear regression, what does the parameter b represent?",
      choices: [
        "The learning rate",
        "The slope of the line",
        "The y-intercept / bias term",
        "The cost function",
      ],
      correctIndex: 2,
      explain:
        "b shifts the line up/down. w controls slope. Learning rate is a training hyperparameter, not part of f(x).",
    },
  },
  {
    id: "s2-cost",
    track: "supervised",
    title: "Cost Function",
    intel: "Cost measures how wrong the model is on the data.",
    xp: 65,
    unlockAfter: ["s1-model"],
    payload: {
      type: "quiz",
      question:
        "For linear regression, the mean squared error cost J(w,b) averages which quantity over the training set?",
      choices: [
        "Absolute error |ŷ − y|",
        "Squared error (ŷ − y)²",
        "Cross-entropy −y log ŷ",
        "Hinge max(0, 1 − yŷ)",
      ],
      correctIndex: 1,
      explain:
        "MSE averages (f(x⁽ⁱ⁾) − y⁽ⁱ⁾)². Squaring punishes large errors and makes the surface differentiable.",
    },
  },
  {
    id: "s3-gd",
    track: "supervised",
    title: "Descent Dodger",
    intel: "Tune w and b until the cost collapses to the target basin.",
    xp: 100,
    unlockAfter: ["s2-cost"],
    payload: {
      type: "gradient",
      prompt:
        "Adjust weight (w) and bias (b) so the line fits the points. Get cost under the threshold.",
      targetW: 2,
      targetB: 1,
      tolerance: 0.35,
      explain:
        "Gradient descent walks downhill on J(w,b). When w≈2 and b≈1 on this synthetic set, cost bottoms out.",
    },
  },
  {
    id: "s4-lr",
    track: "supervised",
    title: "Learning Rate Risk",
    intel: "α too large overshoots; too small crawls forever.",
    xp: 70,
    unlockAfter: ["s3-gd"],
    payload: {
      type: "bug-hunt",
      prompt: "Which line makes gradient descent unstable?",
      lines: [
        "w, b = 0.0, 0.0",
        "alpha = 5.0  # learning rate",
        "for _ in range(100):",
        "    dw, db = compute_gradients(w, b, X, y)",
        "    w = w - alpha * dw",
        "    b = b - alpha * db",
      ],
      bugLine: 1,
      explain:
        "alpha = 5.0 is typically far too large for unnormalized linear regression — updates explode. Start near 0.01–0.1 and tune.",
    },
  },

  // ── Neural ──
  {
    id: "n1-layers",
    track: "neural",
    title: "Layer Sequence",
    intel: "Data flows input → hidden → output.",
    xp: 75,
    unlockAfter: ["s4-lr"],
    payload: {
      type: "order",
      prompt: "Order the forward-pass stages for a simple dense network.",
      items: [
        "Input features x",
        "Linear transform Wx + b",
        "Non-linear activation (e.g. ReLU)",
        "Output prediction ŷ",
      ],
      correctOrder: [0, 1, 2, 3],
      explain:
        "Without a non-linearity between layers, stacked linears collapse to one linear map. Activation is the power.",
    },
  },
  {
    id: "n2-relu",
    track: "neural",
    title: "Activation Choice",
    intel: "ReLU zeros negatives and passes positives.",
    xp: 70,
    unlockAfter: ["n1-layers"],
    payload: {
      type: "quiz",
      question: "What is ReLU(−3.2)?",
      choices: ["−3.2", "0", "3.2", "1"],
      correctIndex: 1,
      explain: "ReLU(z) = max(0, z). Negative pre-activations become 0.",
    },
  },
  {
    id: "n3-backprop",
    track: "neural",
    title: "Backprop Briefing",
    intel: "Gradients flow backward to update every weight.",
    xp: 80,
    unlockAfter: ["n2-relu"],
    payload: {
      type: "quiz",
      question: "Backpropagation primarily computes…",
      choices: [
        "The optimal learning rate analytically",
        "Partial derivatives of the loss w.r.t. each parameter",
        "The number of hidden layers required",
        "A closed-form solution for W*",
      ],
      correctIndex: 1,
      explain:
        "Backprop applies the chain rule so SGD/Adam can update parameters. It does not magically choose architecture or α.",
    },
  },

  // ── Attention ──
  {
    id: "a1-token",
    track: "attention",
    title: "Token Stream",
    intel: "Language models predict the next token.",
    xp: 75,
    unlockAfter: ["n3-backprop"],
    payload: {
      type: "token",
      prompt: "Choose the most likely next token.",
      context: "Gradient descent updates parameters to minimize",
      choices: ["loss", "banana", "CSS", "HTML"],
      correctIndex: 0,
      explain:
        "In ML English, we minimize loss/cost. Autoregressive models learn these statistical continuations.",
    },
  },
  {
    id: "a2-attn",
    track: "attention",
    title: "Attention Focus",
    intel: "Attention mixes token representations by relevance.",
    xp: 85,
    unlockAfter: ["a1-token"],
    payload: {
      type: "quiz",
      question: "In self-attention, queries, keys, and values are…",
      choices: [
        "Three different datasets",
        "Linear projections of the same (or related) token embeddings",
        "Only used in convolutional nets",
        "Hyperparameters set by the user",
      ],
      correctIndex: 1,
      explain:
        "Q, K, V come from learned projections of embeddings. Similarity of Q·Kᵀ routes how V is mixed.",
    },
  },
  {
    id: "a3-gpt",
    track: "attention",
    title: "GPT Instinct",
    intel: "Decoder-only transformers generate left-to-right.",
    xp: 90,
    unlockAfter: ["a2-attn"],
    payload: {
      type: "order",
      prompt: "Order a simplified GPT training step.",
      items: [
        "Tokenize text into IDs",
        "Forward pass through transformer blocks",
        "Compute next-token cross-entropy loss",
        "Backprop and optimizer step",
      ],
      correctOrder: [0, 1, 2, 3],
      explain:
        "Karpathy Zero-to-Hero flow: data → forward → loss → backward → update. Repeat until the model speaks.",
    },
  },

  // ── Fine-tune ──
  {
    id: "t1-lora",
    track: "finetune",
    title: "LoRA Core",
    intel: "Low-rank adapters train tiny matrices, freeze the base.",
    xp: 90,
    unlockAfter: ["a3-gpt"],
    payload: {
      type: "quiz",
      question: "Why is LoRA memory-efficient compared to full fine-tuning?",
      choices: [
        "It deletes half the layers",
        "It only trains small low-rank update matrices while the base model stays frozen",
        "It never uses GPUs",
        "It compresses the dataset to one batch",
      ],
      correctIndex: 1,
      explain:
        "ΔW ≈ BA with small rank r. Far fewer trainable params → smaller optimizer state and faster experiments (Unsloth, PEFT).",
    },
  },
  {
    id: "t2-rank",
    track: "finetune",
    title: "Rank Protocol",
    intel: "Rank r controls adapter capacity vs cost.",
    xp: 85,
    unlockAfter: ["t1-lora"],
    payload: {
      type: "code",
      prompt: "Set a typical starter LoRA rank and alpha in a config dict.",
      template: `lora_config = {
  "r": __A__,
  "lora_alpha": __B__,
  "target_modules": ["q_proj", "v_proj"]
}`,
      blanks: [
        { id: "A", answer: "16", hint: "common small rank (8, 16, 32)" },
        { id: "B", answer: "32", hint: "often 2× rank" },
      ],
      explain:
        "r=16 and lora_alpha=32 is a popular default. Raise r if underfit; watch VRAM if you push high.",
    },
  },

  // ── Deploy ──
  {
    id: "d1-hf",
    track: "deploy",
    title: "Hub Handshake",
    intel: "Ship models and demos where recruiters can click.",
    xp: 80,
    unlockAfter: ["t2-rank"],
    payload: {
      type: "quiz",
      question: "For an xAI-style portfolio, what public artifact best proves you trained/fine-tuned something real?",
      choices: [
        "A private folder of screenshots only",
        "A Hugging Face model card + Space demo + GitHub training code",
        "A LinkedIn post with no links",
        "An uncommitted Jupyter checkpoint",
      ],
      correctIndex: 1,
      explain:
        "Public, runnable proof beats claims. HF Spaces + clean training repo + writeup is the recruit signal.",
    },
  },
  {
    id: "d2-final",
    track: "deploy",
    title: "Recruit Clearance",
    intel: "Final systems check before the MTS application.",
    xp: 120,
    unlockAfter: ["d1-hf"],
    payload: {
      type: "order",
      prompt: "Order the end-to-end recruit protocol.",
      items: [
        "Master fundamentals (Python, ML, math intuition)",
        "Train / fine-tune real models (nanoGPT, LoRA)",
        "Publish GitHub + HF demos, write results",
        "Apply to MTS Model Training with proof of work",
      ],
      correctOrder: [0, 1, 2, 3],
      explain:
        "Skill → artifacts → application. xAI cares that you can train models, not that you watched videos.",
    },
  },
];

export function getMission(id: string): Mission | undefined {
  return MISSIONS.find((m) => m.id === id);
}

export function missionsForTrack(track: TrackId): Mission[] {
  return MISSIONS.filter((m) => m.track === track);
}

export function rankForXp(xp: number): { title: string; level: number; nextAt: number } {
  const thresholds = [0, 100, 250, 450, 700, 1000, 1400, 1900, 2500, 3200];
  const titles = [
    "Recruit",
    "Cadet",
    "Operator",
    "Analyst",
    "Specialist",
    "Engineer",
    "Architect",
    "Staff Candidate",
    "MTS Prospect",
    "Domain Elite",
  ];
  let level = 0;
  for (let i = thresholds.length - 1; i >= 0; i--) {
    if (xp >= thresholds[i]) {
      level = i;
      break;
    }
  }
  const nextAt = thresholds[Math.min(level + 1, thresholds.length - 1)] ?? thresholds[level];
  return { title: titles[level] ?? "Recruit", level: level + 1, nextAt };
}
