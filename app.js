const canvas = document.querySelector("#character-canvas");
const partSelect = document.querySelector("#part-select");
const optionSelect = document.querySelector("#option-select");
const optionFilmstrip = document.querySelector("#option-filmstrip");
const filmstripTrack = document.querySelector("#filmstrip-track");
const filmstripScrollbar = document.querySelector("#filmstrip-scrollbar");
const optionPickerHint = document.querySelector("#option-picker-hint");
const previousOption = document.querySelector("#previous-option");
const nextOption = document.querySelector("#next-option");
const zoomOut = document.querySelector("#zoom-out");
const zoomIn = document.querySelector("#zoom-in");
const zoomRange = document.querySelector("#zoom-range");
const zoomValue = document.querySelector("#zoom-value");
const fitView = document.querySelector("#fit-view");
const flipCharacter = document.querySelector("#flip-character");
const toggleSlots = document.querySelector("#toggle-slots");
const positioningTools = document.querySelector(".positioning-tools");
const toggleCalibration = document.querySelector("#toggle-calibration");
const calibrationPanel = document.querySelector("#calibration-panel");
const slotPositionMeta = document.querySelector("#slot-position-meta");
const exportPng = document.querySelector("#export-png");
const exportSvg = document.querySelector("#export-svg");
const corePartMap = document.querySelector("#core-part-map");
const detailPartNav = document.querySelector("#detail-part-nav");
const scenePartNav = document.querySelector("#scene-part-nav");
const controlsPanel = document.querySelector("#controls-panel");
const openControls = document.querySelector("#open-controls");
const closeControls = document.querySelector("#close-controls");
const controlsBackdrop = document.querySelector("#controls-backdrop");
const activePartName = document.querySelector("#active-part-name");
const activePartCount = document.querySelector("#active-part-count");
const colourTargets = document.querySelector("#colour-targets");
const activeColourSwatches = document.querySelector("#active-colour-swatches");
const activeColourTargetName = document.querySelector("#active-colour-target-name");
const paletteOptions = document.querySelector("#palette-options");
const customColourControl = document.querySelector("#custom-colour-control");
const customColourPicker = document.querySelector("#custom-colour-picker");
const slotX = document.querySelector("#slot-x");
const slotY = document.querySelector("#slot-y");
const effectiveOffsetX = document.querySelector("#effective-offset-x");
const effectiveOffsetY = document.querySelector("#effective-offset-y");
const resetNudge = document.querySelector("#reset-nudge");
const copyCalibration = document.querySelector("#copy-calibration");
const copyStatus = document.querySelector("#copy-status");
const nudgeControls = {
  up: document.querySelector("#nudge-up"),
  left: document.querySelector("#nudge-left"),
  down: document.querySelector("#nudge-down"),
  right: document.querySelector("#nudge-right")
};

const MIN_ZOOM = 0.1;
const MAX_ZOOM = 1.2;
const ZOOM_STEP = 0.05;
const STAGE_PADDING = 260;
const EXPORT_SIZE = 2048;
const EXPORT_PADDING = 96;
const ENABLE_CANVAS_POSITIONING = true;
const ENABLE_CHARACTER_DRAG = true;
const CALIBRATION_STORAGE_KEY = "illustrated-storyboard-toolkit-calibration-v1";
const CHARACTER_STATE_STORAGE_KEY = "illustrated-storyboard-toolkit-character-v1";
const CONTROLS_OVERLAY_QUERY = "(max-width: 980px)";

const SKIN_COLOURS = [
  { label: "Porcelain", value: "#f6d9c8" },
  { label: "Light", value: "#e8b99d" },
  { label: "Medium", value: "#c88968" },
  { label: "Tan", value: "#a9694b" },
  { label: "Deep", value: "#704536" },
  { label: "Dark", value: "#3b2723" },
  { label: "Illustration grey", value: "#b7b5b5" }
];
const GREYSCALE_SKIN_COLOURS = [
  { label: "White", value: "#ffffff" },
  { label: "Light Grey", value: "#e2e2e2" },
  { label: "Grey", value: "#b7b5b5" },
  { label: "Dark Grey", value: "#6d6d68" }
];
const CLOTHING_PALETTES = [
  {
    id: "greyscale",
    label: "Greyscale",
    skinColour: "#b7b5b5",
    skinPalette: GREYSCALE_SKIN_COLOURS,
    colours: [
      ...GREYSCALE_SKIN_COLOURS,
      { label: "Black", value: "#000000" }
    ]
  },
  {
    id: "coastal-sunrise",
    label: "Coastal Sunrise",
    colours: [
      { label: "Sea green", value: "#59b292" },
      { label: "Sunshine", value: "#ffc94d" },
      { label: "Warm cream", value: "#fae7cb" },
      { label: "Coral pink", value: "#fa6781" }
    ]
  },
  {
    id: "blue-horizon",
    label: "Blue Horizon",
    colours: [
      { label: "Deep navy", value: "#293681" },
      { label: "Clear blue", value: "#4274d9" },
      { label: "Sky blue", value: "#95ccdd" },
      { label: "Pale aqua", value: "#d0e7e6" }
    ]
  },
  {
    id: "storyboard-electric",
    label: "Storyboard Electric",
    colours: [
      { label: "Electric purple", value: "#5d1af5" },
      { label: "Soft violet", value: "#7569e9" },
      { label: "Signal orange", value: "#ff6131" }
    ]
  },
  {
    id: "woodland-calm",
    label: "Woodland Calm",
    colours: [
      { label: "Ivory", value: "#fbf5dd" },
      { label: "Oat", value: "#e7e1b1" },
      { label: "Leaf green", value: "#306d29" },
      { label: "Forest green", value: "#0d530e" }
    ]
  },
  {
    id: "sunset-pop",
    label: "Sunset Pop",
    colours: [
      { label: "Peach", value: "#ffca95" },
      { label: "Watermelon", value: "#ff7873" },
      { label: "Hot pink", value: "#e22f80" },
      { label: "Violet", value: "#8140dc" }
    ]
  }
];
const DETAIL_NEUTRALS = [
  { label: "White", value: "#ffffff" },
  { label: "Grey", value: "#b7b5b5" },
  { label: "Black", value: "#000000" }
];
const DEFAULT_SKIN_COLOUR = "#b7b5b5";
const DEFAULT_CLOTHING_COLOUR = "#ffffff";
const CORE_PART_IDS = ["hair", "face", "left-arm", "body", "right-arm", "legs"];
const DETAIL_PART_IDS = ["glasses", "headset", "mask", "wrinkles", "facial-hair"];
const SCENE_PART_IDS = ["table", "seat"];
const PART_NAV_LABELS = { wrinkles: "Age" };
const PART_ASSET_DIRECTORIES = {
  "right-arm": "assets/parts/right-arm/",
  glasses: "assets/parts/glasses/",
  headset: "assets/parts/headset/",
  mask: "assets/parts/mask/",
  wrinkles: "assets/parts/wrinkles/",
  "facial-hair": "assets/parts/facial-hair/",
  face: "assets/parts/face/",
  hair: "assets/parts/head/",
  table: "assets/parts/table/",
  body: "assets/parts/body/",
  legs: "assets/parts/legs/",
  "left-arm": "assets/parts/left-arm/",
  seat: "assets/parts/seat/"
};
const PART_ASSET_MANIFEST = "assets/parts/manifest.json";

const DEFAULT_OPTION_LABELS = {
  "right-arm": "Straight",
  glasses: "Glasses",
  headset: "Headset 1",
  face: "Blank",
  hair: "Short 1",
  table: "Office Desk",
  body: "Plain Sweater",
  legs: "Standing",
  "left-arm": "Straight",
  seat: "Desk Chair"
};

const OPTIONAL_PART_IDS = new Set([
  "glasses",
  "headset",
  "mask",
  "wrinkles",
  "facial-hair",
  "table",
  "seat"
]);

const PART_FILE_LABEL_ALIASES = {
  glasses: {
    eyepatch: "Eyepatch",
    glasses: "Glasses",
    "glasses 2": "Glasses 2",
    "glasses 3": "Glasses 3",
    "glasses 4": "Glasses 4",
    "glasses 5": "Glasses 5",
    "glasses 6": "Glasses 6",
    "glasses 7": "Glasses 7",
    sunglasses: "Sunglasses",
    "sunglasses 2": "Sunglasses 2"
  },
  headset: {
    "headset 1": "Headset 1",
    "headset 2": "Headset 2"
  },
  hair: {
    bun: "Bun",
    "bun 1": "Bun",
    "bun 2": "Bun 2",
    "doctor nurse 2 1": "doctor-nurse-2",
    "doctor nurse 2": "doctor-nurse-2",
    "doctor nurse 3": "doctor-nurse-3",
    "hat beanie": "hat-beanie",
    "hat hip": "hat-hip"
  },
  body: {
    "employee lanyard": "Employee Lanyard",
    "plain sweater": "Plain Sweater",
    "shirt collar": "Shirt Collar",
    "safety vest": "Safety Vest",
    "healthcare worker": "Healthcare Worker"
  },
  legs: {
    "sitting 1": "Sitting 1",
    "sitting 2": "Sitting 2",
    "walking 1": "Walking 1",
    "walking 2": "Walking 2",
    standing: "Standing",
    wheelchair: "Wheelchair",
    "laying in hospital bed": "Laying in Hospital Bed"
  },
  seat: {
    "desk chair": "Desk Chair",
    "cushion chair": "Cushion Chair",
    sofa: "Sofa",
    "wodden chair": "Wodden Chair"
  },
  table: {
    "office desk": "Office Desk",
    "round table 1": "Round Table 1",
    "round table 2": "Round Table 2",
    "round table 3": "Round Table 3"
  },
  "left-arm": {
    "white cane": "White Cane",
    "walking stick": "Walking Stick",
    "guide dog": "Guide Dog",
    "holding toddler": "Holding Toddler",
    "pushing stroller": "Pushing Stroller",
    straight: "Straight",
    out: "Out",
    up: "Up"
  },
  "right-arm": {
    straight: "Straight",
    texting: "Texting",
    "on hip": "On Hip",
    paper: "Paper",
    "phone call": "Phone Call",
    laptop: "Laptop",
    "on table": "On Table",
    "holding child": "Holding Child",
    out: "Out"
  },
  mask: {
    "mask 1": "Mask 1",
    "mask 2": "Mask 2"
  },
  wrinkles: {
    wrinkles: "Wrinkles"
  }
};

const FIGMA_OFFSETS = {
  "right-arm": {
    Straight: { offsetX: 2, offsetY: 0 },
    Texting: { offsetX: 158, offsetY: 0 },
    "On Hip": { offsetX: 35, offsetY: -1 },
    Paper: { offsetX: 207, offsetY: -115 },
    "Phone Call": { offsetX: 194, offsetY: -273 },
    Laptop: { offsetX: 109, offsetY: -16 },
    "On Table": { offsetX: 109, offsetY: -16 },
    "Holding Child": { offsetX: -622, offsetY: -1 },
    Out: { offsetX: -584, offsetY: -6 }
  },
  glasses: {
    Eyepatch: { offsetX: 30, offsetY: -60 },
    Glasses: { offsetX: -2, offsetY: 9 },
    "Glasses 2": { offsetX: 14, offsetY: 8 },
    "Glasses 3": { offsetX: -13, offsetY: 8 },
    "Glasses 4": { offsetX: -11, offsetY: 8 },
    "Glasses 5": { offsetX: 12, offsetY: 11 },
    "Glasses 6": { offsetX: 1, offsetY: 18 },
    Sunglasses: { offsetX: -1, offsetY: 15 },
    "Sunglasses 2": { offsetX: -13, offsetY: 8 }
  },
  headset: {
    "Headset 1": { offsetX: -9, offsetY: -175 },
    "Headset 2": { offsetX: -9, offsetY: -188 }
  },
  mask: {
    "Mask 1": { offsetX: 0, offsetY: 0 },
    "Mask 2": { offsetX: 0, offsetY: 0 }
  },
  wrinkles: {
    Wrinkles: { offsetX: 203, offsetY: -27 }
  },
  "facial-hair": {
    Chin: { offsetX: -3, offsetY: -15 },
    Full: { offsetX: 0, offsetY: 0 },
    "Full 2": { offsetX: -1, offsetY: -18 },
    "Full 3": { offsetX: -5, offsetY: -28 },
    "Full 4": { offsetX: -16, offsetY: -30 },
    "Goatee 1": { offsetX: 112, offsetY: 29 },
    "Goatee 2": { offsetX: 120, offsetY: 27 },
    "Moustache 1": { offsetX: 123, offsetY: 33 },
    "Moustache 2": { offsetX: 109, offsetY: 28 },
    "Moustache 3": { offsetX: 24, offsetY: -20 },
    "Moustache 4": { offsetX: 96, offsetY: 2 },
    "Moustache 5": { offsetX: 103, offsetY: 21 },
    "Moustache 6": { offsetX: 121, offsetY: 28 },
    "Moustache 7": { offsetX: 104, offsetY: 28 },
    "Moustache 8": { offsetX: -221, offsetY: -68 },
    "Moustache 9": { offsetX: 116, offsetY: 27 }
  },
  hair: {
    Afro: { offsetX: -34, offsetY: 7 },
    Bun: { offsetX: -66, offsetY: -35 },
    "Bun 2": { offsetX: -101, offsetY: -98 },
    Bangs: { offsetX: -42, offsetY: 56 },
    "Bangs 2": { offsetX: -26, offsetY: 50 },
    "Bantu Knots": { offsetX: 8, offsetY: 2 },
    Buns: { offsetX: -34, offsetY: -28 },
    Cornrows: { offsetX: -24, offsetY: 27 },
    "Cornrows 2": { offsetX: -49, offsetY: 23 },
    "Flat Top": { offsetX: 53, offsetY: 44 },
    "Flat Top Long": { offsetX: 54, offsetY: -3 },
    "Gray Bun": { offsetX: -26, offsetY: 5 },
    "Gray Medium": { offsetX: -14, offsetY: 55 },
    "Gray Short": { offsetX: 40, offsetY: 51 },
    Hijab: { offsetX: 3, offsetY: 36 },
    Long: { offsetX: -85, offsetY: 31 },
    "Long Afro": { offsetX: -151, offsetY: -120 },
    "Long Bangs": { offsetX: -74, offsetY: 46 },
    "Long Curly": { offsetX: -110, offsetY: -43 },
    "Medium 1": { offsetX: 3, offsetY: 58 },
    "Medium 2": { offsetX: -76, offsetY: 62 },
    "Medium 3": { offsetX: -42, offsetY: 59 },
    "Medium Bangs": { offsetX: -105, offsetY: 47 },
    "Medium Bangs 2": { offsetX: -57, offsetY: 48 },
    "Medium Bangs 3": { offsetX: -2, offsetY: 14 },
    "Medium Straight": { offsetX: -8, offsetY: 42 },
    Mohawk: { offsetX: 41, offsetY: -13 },
    "Mohawk 2": { offsetX: 34, offsetY: 0 },
    "No Hair 1": { offsetX: 44, offsetY: 65 },
    "No Hair 2": { offsetX: 46, offsetY: 44 },
    "No Hair 3": { offsetX: -20, offsetY: 55 },
    Pomp: { offsetX: 37, offsetY: 0 },
    "Shaved 1": { offsetX: 55, offsetY: 5 },
    "Shaved 2": { offsetX: 43, offsetY: -15 },
    "Shaved 3": { offsetX: -8, offsetY: -31 },
    "Short 1": { offsetX: 50, offsetY: 62 },
    "Short 2": { offsetX: 45, offsetY: 64 },
    "Short 3": { offsetX: 11, offsetY: 68 },
    "Short 4": { offsetX: 55, offsetY: 15 },
    "Short 5": { offsetX: 50, offsetY: 54 },
    "Short 6": { offsetX: 48, offsetY: 65 },
    Turban: { offsetX: 13, offsetY: 1 },
    Twists: { offsetX: 5, offsetY: 0 },
    "Twists 2": { offsetX: -7, offsetY: 12 },
    "doctor-nurse-2": { offsetX: -10, offsetY: 6 },
    "doctor-nurse-3": { offsetX: -17, offsetY: 14 },
    "doctor-nurse-2-1": { offsetX: 22, offsetY: 55 },
    "hat-beanie": { offsetX: -15, offsetY: 50 },
    "hat-hip": { offsetX: -62, offsetY: 17 }
  },
  body: {
    Cardigan: { offsetX: 0, offsetY: -14 },
    "Shirt Collar": { offsetX: -1, offsetY: 1 },
    Sweater: { offsetX: -4, offsetY: 6 },
    Pregnant: { offsetX: -6, offsetY: -21 },
    "Baby Carrier": { offsetX: -25, offsetY: -27 },
    "Baby Carrier with Hair": { offsetX: -25, offsetY: -27 },
    "Plain Sweater": { offsetX: -3, offsetY: 6 },
    "Employee Lanyard": { offsetX: -1, offsetY: 0 },
    "Healthcare Worker": { offsetX: -5, offsetY: -44 },
    "Safety Vest": { offsetX: -19, offsetY: -45 }
  },
  legs: {
    "Sitting 2": { offsetX: 0, offsetY: 0 },
    "Sitting 1": { offsetX: 0, offsetY: 0 },
    "Walking 2": { offsetX: -112, offsetY: -21 },
    "Walking 1": { offsetX: -68, offsetY: 0 },
    Standing: { offsetX: 0, offsetY: 0 },
    Wheelchair: { offsetX: -179, offsetY: -817 },
    "Laying in Hospital Bed": { offsetX: -373, offsetY: -946 }
  },
  "left-arm": {
    Straight: { offsetX: -1, offsetY: 0 },
    "White Cane": { offsetX: -20, offsetY: 2 },
    Up: { offsetX: 47, offsetY: -4 },
    "Pushing Stroller": { offsetX: 86, offsetY: 9 },
    "Holding Toddler": { offsetX: 66, offsetY: 0 },
    "Guide Dog": { offsetX: 79, offsetY: 15 },
    "Walking Stick": { offsetX: 86, offsetY: 10 },
    Out: { offsetX: 62, offsetY: -35 }
  },
  seat: {
    Sofa: { offsetX: -958, offsetY: 7 },
    "Wodden Chair": { offsetX: 16, offsetY: -118 },
    "Desk Chair": { offsetX: -130, offsetY: -192 },
    "Cushion Chair": { offsetX: 0, offsetY: -1 }
  },
  table: {
    "Round Table 1": { offsetX: 0, offsetY: 16 },
    "Round Table 2": { offsetX: -19, offsetY: 15 },
    "Round Table 3": { offsetX: -1, offsetY: 15 },
    "Office Desk": { offsetX: -348, offsetY: 11 }
  }
};

const PART_ANCHORS = {
  body: {
    "Employee Lanyard": {
      rightShoulder: { x: 468, y: 178 },
      leftShoulder: { x: 124, y: 184 }
    },
    default: {
      rightShoulder: { x: 468, y: 178 },
      leftShoulder: { x: 124, y: 184 }
    }
  },
  face: {
    Talking: {
      mouthCenter: { x: 162, y: 236 },
      moustacheCenter: { x: 162, y: 218 }
    },
    default: {
      mouthCenter: { x: 162, y: 236 },
      moustacheCenter: { x: 162, y: 218 }
    }
  },
  "facial-hair": {
    Chin: {
      mouthCenter: { x: 139, y: 96 }
    },
    Full: {
      mouthCenter: { x: 198, y: 102 }
    },
    "Full 2": {
      mouthCenter: { x: 204, y: 112 }
    },
    "Full 3": {
      mouthCenter: { x: 212, y: 116 }
    },
    "Full 4": {
      mouthCenter: { x: 218, y: 118 }
    },
    "Goatee 1": {
      mouthCenter: { x: 43, y: 65 }
    },
    "Goatee 2": {
      mouthCenter: { x: 39, y: 67 }
    },
    "Moustache 1": {
      moustacheCenter: { x: 36, y: 42 }
    },
    "Moustache 2": {
      moustacheCenter: { x: 52, y: 47 }
    },
    "Moustache 3": {
      moustacheCenter: { x: 137, y: 88 }
    },
    "Moustache 4": {
      moustacheCenter: { x: 66, y: 72 }
    },
    "Moustache 5": {
      moustacheCenter: { x: 60, y: 53 }
    },
    "Moustache 6": {
      moustacheCenter: { x: 38, y: 47 }
    },
    "Moustache 7": {
      moustacheCenter: { x: 55, y: 47 }
    },
    "Moustache 8": {
      moustacheCenter: { x: 368, y: 108 }
    },
    "Moustache 9": {
      moustacheCenter: { x: 42, y: 48 }
    }
  },
  "right-arm": {
    Paper: {
      shoulder: { x: 516, y: 131 }
    }
  }
};

const ANCHOR_PLACEMENTS = {
  "facial-hair": {
    targetPartId: "face",
    targetAnchorBySourceAnchor: {
      mouthCenter: "mouthCenter",
      moustacheCenter: "moustacheCenter"
    }
  },
  "right-arm": {
    targetPartId: "body",
    sourceAnchor: "shoulder",
    targetAnchor: "rightShoulder"
  }
};

const parts = [
  {
    id: "right-arm",
    label: "Right Arm",
    slot: { x: 77, y: 594, width: 357, height: 989, z: 12 },
    options: [{ label: "Loading..." }]
  },
  {
    id: "glasses",
    label: "Glasses",
    slot: { x: 478, y: 241, width: 392, height: 138, z: 11 },
    options: [{ label: "Loading..." }]
  },
  {
    id: "headset",
    label: "Headset",
    slot: { x: 478, y: 241, width: 392, height: 138, z: 10 },
    options: [{ label: "Loading..." }]
  },
  {
    id: "mask",
    label: "Mask",
    slot: { x: 465, y: 295, width: 397, height: 77, z: 9 },
    options: [{ label: "Loading..." }]
  },
  {
    id: "wrinkles",
    label: "Wrinkles",
    slot: { x: 478, y: 241, width: 392, height: 138, z: 8 },
    options: [{ label: "Loading..." }]
  },
  {
    id: "facial-hair",
    label: "Facial Hair",
    slot: { x: 567, y: 343, width: 280, height: 230, z: 7 },
    options: [{ label: "Loading..." }]
  },
  {
    id: "face",
    label: "Face",
    slot: { x: 599, y: 198, width: 289, height: 293, z: 6 },
    options: [{ label: "Loading..." }]
  },
  {
    id: "hair",
    label: "Hair",
    figmaName: "head",
    slot: { x: 431, y: 0, width: 473, height: 567, z: 5 },
    options: [{ label: "Loading..." }]
  },
  {
    id: "table",
    label: "Table",
    slot: { x: 0, y: 1064, width: 1897, height: 399, z: 4 },
    options: [{ label: "Loading..." }]
  },
  {
    id: "body",
    label: "Body",
    slot: { x: 333, y: 432, width: 585, height: 929, z: 3 },
    options: [{ label: "Loading..." }]
  },
  {
    id: "legs",
    label: "Legs",
    slot: { x: 238, y: 1211, width: 767, height: 1580, z: 2 },
    options: [{ label: "Loading..." }]
  },
  {
    id: "left-arm",
    label: "Left Arm",
    slot: { x: 775, y: 585, width: 453, height: 839, z: 1 },
    options: [{ label: "Loading..." }]
  },
  {
    id: "seat",
    label: "Seat",
    slot: { x: 170, y: 861, width: 1110, height: 831, z: 0 },
    options: [{ label: "Loading..." }]
  }
];

const selections = Object.fromEntries(parts.map((part) => [part.id, 0]));
const visibility = Object.fromEntries(parts.map((part) => [part.id, !OPTIONAL_PART_IDS.has(part.id)]));
const ruleHiddenPartIds = new Set();
let skinColour = DEFAULT_SKIN_COLOUR;
const clothingColours = {};
let activeColourTargetKey = "skin";
let activeClothingPaletteId = CLOTHING_PALETTES[0].id;
let defaultCalibrationOverrides = {};
let calibrationOverrides = loadCalibrationOverrides();
let activePartId = "right-arm";
let layoutOffset = { x: 0, y: 0 };
let canvasBounds = { width: 1, height: 1 };
let canvasZoom = 1;
let characterOffset = { x: 0, y: 0 };
let isCharacterFlipped = false;
let dragState = null;
let suppressNextClick = false;
let calibrationEditMode = false;
let isPartEditorOpen = true;
canvas.style.transformOrigin = "top left";

function render() {
  applyVisibilityRules();
  updateCanvasBounds();
  renderCanvas();
  renderControls();
  updateCharacterFlipControl();
  saveCharacterState();
}

function renderCanvas() {
  canvas.querySelectorAll(".slot").forEach((slot) => slot.remove());

  parts.forEach((part) => {
    if (!isPartVisible(part.id)) {
      return;
    }

    const slot = document.createElement("button");
    const selectedOption = part.options[selections[part.id]];

    slot.type = "button";
    slot.className = `slot${part.id === activePartId ? " is-active" : ""}`;
    positionSlot(slot, part);
    slot.style.top = `${part.slot.y - layoutOffset.y + characterOffset.y}px`;
    slot.style.width = `${part.slot.width}px`;
    slot.style.height = `${part.slot.height}px`;
    slot.style.zIndex = part.slot.z;
    slot.dataset.part = part.id;
    slot.setAttribute("aria-label", `${part.label}: ${selectedOption.label}`);
    slot.innerHTML = assetArt(selectedOption, getEffectivePartOffset(part, selectedOption));
    if (ENABLE_CHARACTER_DRAG) {
      slot.addEventListener("pointerdown", (event) => beginCharacterDrag(event, part.id));
    }
    slot.addEventListener("click", (event) => {
      if (suppressNextClick) {
        event.preventDefault();
        return;
      }
      setActivePart(part.id);
    });

    canvas.appendChild(slot);
  });
}

function renderControls() {
  partSelect.innerHTML = parts
    .map((part) => `<option value="${part.id}">${part.label}</option>`)
    .join("");
  partSelect.value = activePartId;

  renderColourStudio();
  renderPartNavigator();

  const part = getActivePart();
  optionSelect.innerHTML = part.options
    .map((option, index) => `<option value="${index}">${option.label}</option>`)
    .join("");
  optionSelect.value = String(selections[part.id]);

  activePartName.textContent = isPartEditorOpen ? part.label : "No part selected";
  activePartCount.textContent = isPartEditorOpen ? `${selections[part.id] + 1}/${part.options.length}` : "—";
  activePartCount.classList.toggle("is-empty", !isPartEditorOpen);
  activePartCount.setAttribute("aria-hidden", String(!isPartEditorOpen));
  renderOptionFilmstrip(part);
  slotX.textContent = part.slot.x;
  slotY.textContent = part.slot.y;
  const selectedOption = getSelectedOption(part);
  const effectiveOffset = getEffectivePartOffset(part, selectedOption);
  effectiveOffsetX.textContent = effectiveOffset.offsetX;
  effectiveOffsetY.textContent = effectiveOffset.offsetY;
}

function renderPartNavigator() {
  corePartMap.innerHTML = `
    <svg class="doll-silhouette" viewBox="0 0 160 280" aria-hidden="true" focusable="false">
      <circle class="doll-head" cx="80" cy="39" r="27"></circle>
      <path class="doll-neck" d="M67 65v12M93 65v12"></path>
      <path class="doll-torso" d="M51 78Q80 67 109 78l10 91Q80 185 41 169l10-91Z"></path>
      <path class="doll-arms" d="M50 84Q28 105 12 164M110 84q22 21 38 80"></path>
      <path class="doll-legs" d="M60 177 48 263M100 177l12 86"></path>
      <circle class="doll-hands" cx="10" cy="169" r="5"></circle>
      <circle class="doll-hands" cx="150" cy="169" r="5"></circle>
    </svg>
  `;

  CORE_PART_IDS.forEach((partId) => {
    const part = parts.find((candidate) => candidate.id === partId);
    if (!part) {
      return;
    }

    const button = document.createElement("button");
    button.type = "button";
    button.className = `part-hotspot part-hotspot-${partId}${partId === activePartId ? " is-active" : ""}`;
    button.dataset.part = partId;
    button.textContent = part.label;
    button.setAttribute("aria-pressed", String(partId === activePartId));
    button.setAttribute("title", `${part.label}: ${getSelectedOption(part).label}`);
    button.addEventListener("click", () => setActivePart(partId));
    corePartMap.appendChild(button);
  });

  renderPartChipRail(detailPartNav, DETAIL_PART_IDS);
  renderPartChipRail(scenePartNav, SCENE_PART_IDS);
}

function renderPartChipRail(container, partIds) {
  container.innerHTML = "";

  partIds.forEach((partId) => {
    const part = parts.find((candidate) => candidate.id === partId);
    if (!part) {
      return;
    }

    const button = document.createElement("button");
    const isVisible = isPartVisible(partId);
    const isRuleHidden = ruleHiddenPartIds.has(partId);
    const isEditing = isPartEditorOpen && partId === activePartId;
    button.type = "button";
    button.className = `part-chip${isEditing ? " is-active" : ""}${isVisible ? " is-included" : ""}`;
    button.dataset.part = partId;
    button.disabled = isRuleHidden;
    const navigationLabel = PART_NAV_LABELS[partId] || part.label;
    button.innerHTML = `<span class="part-chip-status" aria-hidden="true"></span><span>${navigationLabel}</span>`;
    button.setAttribute("aria-pressed", String(isVisible));
    button.setAttribute("aria-label", `${navigationLabel}, ${isVisible ? "included" : "not included"}`);
    button.setAttribute("title", isRuleHidden ? `${part.label} is unavailable with the current pose` : `${part.label}: ${getSelectedOption(part).label}`);
    button.addEventListener("click", () => togglePartVisibility(partId));
    container.appendChild(button);
  });
}

function renderOptionFilmstrip(part) {
  const isEnabled = isPartEditorOpen && (!OPTIONAL_PART_IDS.has(part.id) || visibility[part.id]);
  previousOption.disabled = !isEnabled || part.options.length < 2;
  nextOption.disabled = !isEnabled || part.options.length < 2;
  filmstripTrack.hidden = !isEnabled;
  optionPickerHint.hidden = isEnabled;
  optionPickerHint.textContent = "Select a part to see its styles.";
  optionFilmstrip.innerHTML = "";
  optionFilmstrip.setAttribute("aria-label", `${part.label} styles`);

  if (!isEnabled) {
    window.requestAnimationFrame(updateFilmstripScrollbar);
    return;
  }

  let selectedTile = null;

  part.options.forEach((option, index) => {
    const tile = document.createElement("button");
    const preview = document.createElement("span");
    const label = document.createElement("span");

    tile.type = "button";
    tile.className = "option-tile";
    tile.dataset.optionIndex = String(index);
    tile.setAttribute("role", "option");
    tile.setAttribute("aria-label", option.label);
    tile.setAttribute("aria-selected", String(index === selections[part.id]));

    preview.className = "option-tile-preview";
    if (option.src) {
      const image = document.createElement("img");
      image.src = option.src;
      image.alt = "";
      image.loading = index === selections[part.id] ? "eager" : "lazy";
      preview.appendChild(image);
    } else {
      preview.textContent = "—";
    }

    label.className = "option-tile-label";
    label.textContent = option.label;
    tile.append(preview, label);
    tile.addEventListener("click", () => {
      selections[part.id] = index;
      render();
    });

    if (index === selections[part.id]) {
      selectedTile = tile;
    }

    optionFilmstrip.appendChild(tile);
  });

  if (selectedTile) {
    centerFilmstripTile(selectedTile);
  }
}

function centerFilmstripTile(tile) {
  window.requestAnimationFrame(() => {
    if (!tile.isConnected || optionFilmstrip.clientWidth === 0) {
      return;
    }

    const filmstripBounds = optionFilmstrip.getBoundingClientRect();
    const tileBounds = tile.getBoundingClientRect();
    const tileCenter = optionFilmstrip.scrollLeft
      + tileBounds.left
      - filmstripBounds.left
      + tileBounds.width / 2;
    const maximumScroll = Math.max(0, optionFilmstrip.scrollWidth - optionFilmstrip.clientWidth);
    const targetScroll = clamp(tileCenter - optionFilmstrip.clientWidth / 2, 0, maximumScroll);

    optionFilmstrip.scrollLeft = targetScroll;
    updateFilmstripScrollbar();
  });
}

function updateFilmstripScrollbar() {
  const maximumScroll = filmstripTrack.hidden
    ? 0
    : Math.max(0, optionFilmstrip.scrollWidth - optionFilmstrip.clientWidth);

  filmstripScrollbar.max = String(Math.max(1, maximumScroll));
  filmstripScrollbar.value = String(Math.min(maximumScroll, optionFilmstrip.scrollLeft));
  filmstripScrollbar.disabled = maximumScroll <= 0;
}

function eyeIcon(isVisible) {
  return `
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z"></path>
      <circle cx="12" cy="12" r="2.6"></circle>
      ${isVisible ? "" : '<path class="eye-slash" d="M4 20 20 4"></path>'}
    </svg>
  `;
}

function shuffleIcon() {
  return `
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M3 7h3.2c4.8 0 6.6 10 11.6 10H21"></path>
      <path d="m18 14 3 3-3 3"></path>
      <path d="M3 17h3.2c1.9 0 3.3-1.6 4.6-3.5M14.2 8.4c1-1 2.1-1.4 3.6-1.4H21"></path>
      <path d="m18 4 3 3-3 3"></path>
    </svg>
  `;
}

function renderColourStudio() {
  const layers = getVisibleClothingLayers();
  const activeClothingPalette = getActiveClothingPalette();
  const targets = [{
    key: "skin",
    label: "Skin",
    value: skinColour,
    palette: activeClothingPalette.skinPalette || SKIN_COLOURS
  }];

  layers.forEach((layer, displayIndex) => {
    if (!clothingColours[layer.key]) {
      clothingColours[layer.key] = DEFAULT_CLOTHING_COLOUR;
    }

    targets.push({
      key: `clothing-${layer.key}`,
      layerKey: layer.key,
      label: `Clothing ${displayIndex + 1}`,
      value: clothingColours[layer.key],
      palette: uniqueColours([...activeClothingPalette.colours, ...DETAIL_NEUTRALS])
    });
  });

  if (!targets.some((target) => target.key === activeColourTargetKey)) {
    activeColourTargetKey = "skin";
  }

  const activeTarget = targets.find((target) => target.key === activeColourTargetKey) || targets[0];
  activeColourTargetName.textContent = `${activeClothingPalette.label} palette`;
  paletteOptions.innerHTML = "";
  colourTargets.innerHTML = "";
  activeColourSwatches.innerHTML = "";
  activeColourSwatches.setAttribute("aria-label", `${activeTarget.label} colours`);

  CLOTHING_PALETTES.forEach((palette) => {
    const isSelected = palette.id === activeClothingPalette.id;
    const row = document.createElement("div");
    row.className = `palette-option-row${isSelected ? " is-selected" : ""}`;
    row.setAttribute("role", "presentation");

    const button = document.createElement("button");
    button.type = "button";
    button.className = "palette-option";
    button.setAttribute("role", "radio");
    button.setAttribute("aria-checked", String(isSelected));
    button.setAttribute("aria-label", isSelected ? `${palette.label}, selected` : palette.label);
    button.innerHTML = `
      <span class="palette-preview" aria-hidden="true">
        ${palette.colours.map((colour) => `<span style="--palette-colour:${colour.value}"></span>`).join("")}
      </span>
      <span class="palette-option-label">${palette.label}</span>
    `;
    button.addEventListener("click", () => {
      if (isSelected) {
        return;
      }
      activeClothingPaletteId = palette.id;
      if (palette.skinColour) {
        skinColour = palette.skinColour;
      }
      applyPaletteToClothing(palette, layers);
      render();
    });
    row.appendChild(button);

    if (isSelected) {
      const randomiseButton = document.createElement("button");
      randomiseButton.type = "button";
      randomiseButton.className = "palette-randomise-button";
      randomiseButton.setAttribute("aria-label", `Randomise ${palette.label} colours`);
      randomiseButton.title = "Randomise colours";
      randomiseButton.innerHTML = shuffleIcon();
      randomiseButton.addEventListener("click", () => {
        applyPaletteToClothing(palette, layers);
        render();
      });
      row.appendChild(randomiseButton);
    }

    paletteOptions.appendChild(row);
  });

  targets.forEach((target) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "colour-target";
    button.setAttribute("role", "tab");
    button.setAttribute("aria-selected", String(target.key === activeTarget.key));
    button.innerHTML = `<span class="colour-target-dot" style="--target-colour:${target.value}" aria-hidden="true"></span><span>${target.label}</span>`;
    button.addEventListener("click", () => {
      activeColourTargetKey = target.key;
      renderColourStudio();
      saveCharacterState();
    });
    colourTargets.appendChild(button);
  });

  activeTarget.palette.forEach((colour) => {
    const swatch = document.createElement("button");
    swatch.type = "button";
    swatch.className = "swatch-button";
    swatch.style.setProperty("--swatch-colour", colour.value);
    swatch.style.setProperty("--swatch-check", getContrastColour(colour.value));
    swatch.dataset.colour = colour.value;
    swatch.setAttribute("role", "radio");
    swatch.setAttribute("aria-label", colour.label);
    swatch.setAttribute("aria-checked", String(colour.value === activeTarget.value));
    swatch.innerHTML = '<span aria-hidden="true">✓</span>';
    swatch.addEventListener("click", () => {
      if (activeTarget.key === "skin") {
        skinColour = colour.value;
      } else {
        clothingColours[activeTarget.layerKey] = colour.value;
      }
      render();
    });
    activeColourSwatches.appendChild(swatch);
  });

  const isClothingTarget = activeTarget.key !== "skin";
  customColourControl.hidden = !isClothingTarget;
  if (isClothingTarget) {
    customColourPicker.value = normalizeHexColour(activeTarget.value) || DEFAULT_CLOTHING_COLOUR;
    customColourPicker.oninput = () => {
      clothingColours[activeTarget.layerKey] = customColourPicker.value.toLowerCase();
      render();
    };
  } else {
    customColourPicker.oninput = null;
  }
}

function getActiveClothingPalette() {
  return CLOTHING_PALETTES.find((palette) => palette.id === activeClothingPaletteId) || CLOTHING_PALETTES[0];
}

function uniqueColours(colours) {
  return colours.filter(
    (colour, index) => colours.findIndex((candidate) => candidate.value.toLowerCase() === colour.value.toLowerCase()) === index
  );
}

function applyPaletteToClothing(palette, layers = getVisibleClothingLayers()) {
  if (!layers.length || !palette.colours.length) {
    return;
  }

  const shuffledColours = [...palette.colours].sort(() => Math.random() - 0.5);
  const startIndex = Math.floor(Math.random() * shuffledColours.length);
  layers.forEach((layer, index) => {
    clothingColours[layer.key] = shuffledColours[(startIndex + index) % shuffledColours.length].value;
  });
}

function normalizeHexColour(value) {
  return typeof value === "string" && /^#[0-9a-f]{6}$/i.test(value) ? value.toLowerCase() : null;
}

function getContrastColour(hexColour) {
  const red = Number.parseInt(hexColour.slice(1, 3), 16);
  const green = Number.parseInt(hexColour.slice(3, 5), 16);
  const blue = Number.parseInt(hexColour.slice(5, 7), 16);
  return red * 0.299 + green * 0.587 + blue * 0.114 > 150 ? "#161616" : "#ffffff";
}

function getVisibleClothingLayers() {
  const layerKeys = new Set();

  parts.forEach((part) => {
    if (!isPartVisible(part.id)) {
      return;
    }

    const option = getSelectedOption(part);
    getClothingLayerKeys(option.svgText).forEach((key) => layerKeys.add(key));
  });

  return [...layerKeys]
    .sort((left, right) => left - right)
    .map((key) => ({ key }));
}

function getClothingLayerKeys(svgText) {
  if (!svgText) {
    return [];
  }

  const doc = new DOMParser().parseFromString(svgText, "image/svg+xml");
  return [...doc.querySelectorAll("[id]")]
    .map((element) => getClothingLayerKey(element.id))
    .filter(Boolean);
}

function getClothingLayerKey(id) {
  const normalizedId = id.trim().toLowerCase().replace(/[-_]+/g, " ").replace(/\s+/g, " ");
  const match = normalizedId.match(/^clothing(?: (\d+))?$/);

  if (!match) {
    return null;
  }

  return Number(match[1] || 1);
}

function getActivePart() {
  return parts.find((part) => part.id === activePartId);
}

function getFigmaPartName(part) {
  return part.figmaName || part.label;
}

function setActivePart(partId) {
  activePartId = partId;
  isPartEditorOpen = true;
  render();
}

function cycleOption(direction) {
  cyclePartOption(activePartId, direction);
}

function cyclePartOption(partId, direction) {
  const part = parts.find((candidate) => candidate.id === partId);
  const current = selections[part.id];
  const next = (current + direction + part.options.length) % part.options.length;
  selections[part.id] = next;
  activePartId = part.id;
  isPartEditorOpen = true;
  render();
}

function getSelectedOption(part) {
  return part.options[selections[part.id]];
}

function getEffectivePartOffset(part, option, visitedPartIds = new Set()) {
  const fallbackOffset = applyCalibrationOverride(part, option, {
    offsetX: option.offsetX || 0,
    offsetY: option.offsetY || 0
  });
  const placement = ANCHOR_PLACEMENTS[part.id];
  const sourceAnchors = getOptionAnchors(part.id, option.label);

  if (!placement || !sourceAnchors || visitedPartIds.has(part.id)) {
    return fallbackOffset;
  }

  const sourceAnchorName = getSourceAnchorName(placement, sourceAnchors);
  const sourceAnchor = sourceAnchors[sourceAnchorName];
  const targetPart = parts.find((candidate) => candidate.id === placement.targetPartId);

  if (!sourceAnchorName || !sourceAnchor || !targetPart) {
    return fallbackOffset;
  }

  const targetOption = getSelectedOption(targetPart);
  const targetAnchorName = getTargetAnchorName(placement, sourceAnchorName);
  const targetAnchor = getOptionAnchors(targetPart.id, targetOption.label)?.[targetAnchorName];

  if (!targetAnchor) {
    return fallbackOffset;
  }

  const nextVisitedPartIds = new Set(visitedPartIds);
  nextVisitedPartIds.add(part.id);
  const targetOffset = getEffectivePartOffset(targetPart, targetOption, nextVisitedPartIds);

  return applyCalibrationOverride(part, option, {
    offsetX: targetPart.slot.x + targetOffset.offsetX + targetAnchor.x - part.slot.x - sourceAnchor.x,
    offsetY: targetPart.slot.y + targetOffset.offsetY + targetAnchor.y - part.slot.y - sourceAnchor.y
  });
}

function applyCalibrationOverride(part, option, offset) {
  const override = getCalibrationOverride(getCalibrationKey(part.id, option.label));
  if (!override) {
    return offset;
  }

  return {
    offsetX: offset.offsetX + (override.x || 0),
    offsetY: offset.offsetY + (override.y || 0)
  };
}

function getCalibrationKey(partId, label) {
  return `${partId}:${label}`;
}

function getCurrentCalibrationKey() {
  const part = getActivePart();
  return getCalibrationKey(part.id, getSelectedOption(part).label);
}

function getCalibrationOverride(key) {
  return calibrationOverrides[key] || defaultCalibrationOverrides[key];
}

function getNudgeStep() {
  return Number(document.querySelector('input[name="nudge-step"]:checked')?.value || 1);
}

function nudgeActivePart(deltaX, deltaY) {
  const key = getCurrentCalibrationKey();
  const current = getCalibrationOverride(key) || { x: 0, y: 0 };
  calibrationOverrides[key] = {
    x: current.x + deltaX,
    y: current.y + deltaY
  };
  saveCalibrationOverrides();
  copyStatus.textContent = "";
  render();
}

function resetActiveNudge() {
  delete calibrationOverrides[getCurrentCalibrationKey()];
  saveCalibrationOverrides();
  copyStatus.textContent = "";
  render();
}

function loadCalibrationOverrides() {
  try {
    const stored = window.localStorage.getItem(CALIBRATION_STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch (error) {
    console.warn("Unable to load calibration overrides.", error);
    return {};
  }
}

function saveCalibrationOverrides() {
  window.localStorage.setItem(CALIBRATION_STORAGE_KEY, JSON.stringify(calibrationOverrides));
}

function saveCharacterState() {
  const selectedStyles = Object.fromEntries(
    parts.map((part) => [part.id, getSelectedOption(part)?.label]).filter(([, label]) => label)
  );
  const savedVisibility = Object.fromEntries(
    [...OPTIONAL_PART_IDS].map((partId) => [partId, Boolean(visibility[partId])])
  );

  try {
    window.localStorage.setItem(
      CHARACTER_STATE_STORAGE_KEY,
      JSON.stringify({
        selectedStyles,
        visibility: savedVisibility,
        skinColour,
        clothingColours: { ...clothingColours },
        activeClothingPaletteId,
        activeColourTargetKey,
        activePartId,
        isPartEditorOpen,
        isCharacterFlipped
      })
    );
  } catch (error) {
    console.warn("Unable to save the character configuration.", error);
  }
}

function restoreCharacterState() {
  try {
    const stored = window.localStorage.getItem(CHARACTER_STATE_STORAGE_KEY);
    if (!stored) {
      return;
    }

    const savedState = JSON.parse(stored);

    parts.forEach((part) => {
      const savedLabel = savedState.selectedStyles?.[part.id];
      const savedIndex = part.options.findIndex((option) => option.label === savedLabel);
      if (savedIndex >= 0) {
        selections[part.id] = savedIndex;
      }
    });

    OPTIONAL_PART_IDS.forEach((partId) => {
      if (typeof savedState.visibility?.[partId] === "boolean") {
        visibility[partId] = savedState.visibility[partId];
      }
    });

    const savedSkinColour = normalizeHexColour(savedState.skinColour);
    const availableSkinColours = uniqueColours([
      ...SKIN_COLOURS,
      ...CLOTHING_PALETTES.flatMap((palette) => palette.skinPalette || [])
    ]);
    if (savedSkinColour && availableSkinColours.some((colour) => colour.value === savedSkinColour)) {
      skinColour = savedSkinColour;
    }

    Object.entries(savedState.clothingColours || {}).forEach(([layerKey, colour]) => {
      const normalizedColour = normalizeHexColour(colour);
      if (normalizedColour) {
        clothingColours[layerKey] = normalizedColour;
      }
    });

    if (CLOTHING_PALETTES.some((palette) => palette.id === savedState.activeClothingPaletteId)) {
      activeClothingPaletteId = savedState.activeClothingPaletteId;
    }

    if (typeof savedState.activeColourTargetKey === "string") {
      activeColourTargetKey = savedState.activeColourTargetKey;
    }

    if (parts.some((part) => part.id === savedState.activePartId)) {
      activePartId = savedState.activePartId;
    }

    if (typeof savedState.isPartEditorOpen === "boolean") {
      isPartEditorOpen = savedState.isPartEditorOpen;
    }

    if (typeof savedState.isCharacterFlipped === "boolean") {
      isCharacterFlipped = savedState.isCharacterFlipped;
    }
  } catch (error) {
    console.warn("Unable to restore the saved character configuration.", error);
  }
}

async function copyCalibrationJson() {
  const payload = JSON.stringify({ ...defaultCalibrationOverrides, ...calibrationOverrides }, null, 2);
  try {
    await navigator.clipboard.writeText(payload);
    copyStatus.textContent = "Calibration JSON copied";
  } catch (error) {
    copyStatus.textContent = payload;
  }
}

function getOptionAnchors(partId, label) {
  const anchorsByLabel = PART_ANCHORS[partId];
  if (!anchorsByLabel) {
    return null;
  }

  return anchorsByLabel[label] || anchorsByLabel[resolveMetadataLabel(partId, label)] || anchorsByLabel.default || null;
}

function getSourceAnchorName(placement, sourceAnchors) {
  if (placement.sourceAnchor) {
    return sourceAnchors[placement.sourceAnchor] ? placement.sourceAnchor : null;
  }

  return Object.keys(placement.targetAnchorBySourceAnchor || {}).find((anchorName) => sourceAnchors[anchorName]) || null;
}

function getTargetAnchorName(placement, sourceAnchorName) {
  if (placement.targetAnchor) {
    return placement.targetAnchor;
  }

  return placement.targetAnchorBySourceAnchor?.[sourceAnchorName] || null;
}

function getSelectedPartLabel(partId) {
  const part = parts.find((candidate) => candidate.id === partId);
  return part ? getSelectedOption(part)?.label : "";
}

function getSelectedPartKey(partId) {
  return canonicalizeLabel(getSelectedPartLabel(partId));
}

function isPartVisible(partId) {
  return visibility[partId] && !ruleHiddenPartIds.has(partId);
}

function applyVisibilityRules() {
  ruleHiddenPartIds.clear();

  const selectedLegs = getSelectedPartKey("legs");
  if (selectedLegs === "laying in hospital bed") {
    ruleHiddenPartIds.add("right-arm");
    ruleHiddenPartIds.add("body");
    ruleHiddenPartIds.add("left-arm");
    ruleHiddenPartIds.add("table");
    ruleHiddenPartIds.add("seat");
  }

  if (selectedLegs === "wheelchair") {
    ruleHiddenPartIds.add("body");
    ruleHiddenPartIds.add("seat");
  }
}

function getOptionBounds(part, option) {
  const offset = getEffectivePartOffset(part, option);
  const assetLeft = part.slot.x + offset.offsetX;
  const assetTop = part.slot.y + offset.offsetY;
  const assetRight = option.src ? assetLeft + option.assetWidth : part.slot.x + part.slot.width;
  const assetBottom = option.src ? assetTop + option.assetHeight : part.slot.y + part.slot.height;

  return {
    minX: Math.min(part.slot.x, assetLeft),
    minY: Math.min(part.slot.y, assetTop),
    maxX: Math.max(part.slot.x + part.slot.width, assetRight),
    maxY: Math.max(part.slot.y + part.slot.height, assetBottom)
  };
}

function updateCanvasBounds() {
  const visibleParts = parts.filter((part) => isPartVisible(part.id));
  if (visibleParts.length === 0) {
    layoutOffset = { x: 0, y: 0 };
    canvasBounds = { width: 1, height: 1 };
    canvas.style.width = "1px";
    canvas.style.height = "1px";
    return;
  }

  const bounds = visibleParts.reduce(
    (acc, part) => {
      const optionBounds = part.options.reduce(
        (partBounds, option) => {
          const boundsForOption = getOptionBounds(part, option);
          partBounds.minX = Math.min(partBounds.minX, boundsForOption.minX);
          partBounds.minY = Math.min(partBounds.minY, boundsForOption.minY);
          partBounds.maxX = Math.max(partBounds.maxX, boundsForOption.maxX);
          partBounds.maxY = Math.max(partBounds.maxY, boundsForOption.maxY);
          return partBounds;
        },
        { minX: Infinity, minY: Infinity, maxX: -Infinity, maxY: -Infinity }
      );

      acc.minX = Math.min(acc.minX, optionBounds.minX);
      acc.minY = Math.min(acc.minY, optionBounds.minY);
      acc.maxX = Math.max(acc.maxX, optionBounds.maxX);
      acc.maxY = Math.max(acc.maxY, optionBounds.maxY);
      return acc;
    },
    { minX: Infinity, minY: Infinity, maxX: -Infinity, maxY: -Infinity }
  );

  layoutOffset = { x: bounds.minX - STAGE_PADDING, y: bounds.minY - STAGE_PADDING };
  canvasBounds = {
    width: Math.ceil(bounds.maxX - bounds.minX + STAGE_PADDING * 2),
    height: Math.ceil(bounds.maxY - bounds.minY + STAGE_PADDING * 2)
  };
  canvas.style.width = `${canvasBounds.width}px`;
  canvas.style.height = `${canvasBounds.height}px`;
  updateCharacterNamePosition();
}

function togglePartVisibility(partId) {
  if (!OPTIONAL_PART_IDS.has(partId)) {
    return;
  }

  const shouldInclude = !visibility[partId];
  visibility[partId] = shouldInclude;
  activePartId = partId;
  isPartEditorOpen = shouldInclude;
  render();
}

function setControlsPanelOpen(isOpen, { restoreFocus = false } = {}) {
  const shouldOpen = isOpen && window.matchMedia(CONTROLS_OVERLAY_QUERY).matches;
  controlsPanel.classList.toggle("is-open", shouldOpen);
  controlsBackdrop.hidden = !shouldOpen;
  openControls.setAttribute("aria-expanded", String(shouldOpen));
  document.body.classList.toggle("controls-overlay-open", shouldOpen);

  if (shouldOpen) {
    closeControls.focus();
  } else if (restoreFocus) {
    openControls.focus();
  }
}

partSelect.addEventListener("change", (event) => {
  setActivePart(event.target.value);
});

optionSelect.addEventListener("change", (event) => {
  selections[activePartId] = Number(event.target.value);
  render();
});

openControls.addEventListener("click", () => setControlsPanelOpen(true));
closeControls.addEventListener("click", () => setControlsPanelOpen(false, { restoreFocus: true }));
controlsBackdrop.addEventListener("click", () => setControlsPanelOpen(false, { restoreFocus: true }));
window.matchMedia(CONTROLS_OVERLAY_QUERY).addEventListener("change", (event) => {
  if (!event.matches) {
    setControlsPanelOpen(false);
  }
});

previousOption.addEventListener("click", () => cycleOption(-1));
nextOption.addEventListener("click", () => cycleOption(1));
previousOption.addEventListener("mousedown", (event) => event.preventDefault());
nextOption.addEventListener("mousedown", (event) => event.preventDefault());
filmstripScrollbar.addEventListener("input", (event) => {
  optionFilmstrip.scrollLeft = Number(event.target.value);
});
optionFilmstrip.addEventListener("scroll", updateFilmstripScrollbar, { passive: true });
resetNudge.addEventListener("click", resetActiveNudge);
copyCalibration.addEventListener("click", copyCalibrationJson);
nudgeControls.up.addEventListener("click", () => nudgeActivePart(0, -getNudgeStep()));
nudgeControls.left.addEventListener("click", () => nudgeActivePart(-getNudgeStep(), 0));
nudgeControls.down.addEventListener("click", () => nudgeActivePart(0, getNudgeStep()));
nudgeControls.right.addEventListener("click", () => nudgeActivePart(getNudgeStep(), 0));
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && controlsPanel.classList.contains("is-open")) {
    setControlsPanelOpen(false, { restoreFocus: true });
    return;
  }

  if (!calibrationEditMode) {
    return;
  }

  if (event.target.matches("input, select, textarea, button")) {
    return;
  }

  const step = event.shiftKey ? 10 : getNudgeStep();
  const nudges = {
    ArrowUp: [0, -step],
    ArrowRight: [step, 0],
    ArrowDown: [0, step],
    ArrowLeft: [-step, 0]
  };
  const nudge = nudges[event.key];

  if (!nudge) {
    return;
  }

  event.preventDefault();
  nudgeActivePart(nudge[0], nudge[1]);
});

toggleCalibration.addEventListener("click", () => {
  calibrationEditMode = !calibrationEditMode;
  calibrationPanel.hidden = !calibrationEditMode;
  slotPositionMeta.hidden = !calibrationEditMode;
  positioningTools.hidden = !calibrationEditMode;
  if (!calibrationEditMode) {
    setSlotOutlinesVisible(false);
  }
  toggleCalibration.setAttribute("aria-pressed", String(calibrationEditMode));
  toggleCalibration.textContent = calibrationEditMode ? "Done" : "Edit positions";
});

function setSlotOutlinesVisible(isVisible) {
  canvas.classList.toggle("show-slots", isVisible);
  toggleSlots.setAttribute("aria-pressed", String(isVisible));
  toggleSlots.setAttribute("aria-label", `${isVisible ? "Hide" : "Show"} slot outlines`);
  toggleSlots.setAttribute("title", `${isVisible ? "Hide" : "Show"} slot outlines`);
}

if (ENABLE_CANVAS_POSITIONING) {
  if (ENABLE_CHARACTER_DRAG) {
    canvas.classList.add("positioning-enabled");
  }

  toggleSlots.addEventListener("click", () => {
    setSlotOutlinesVisible(!canvas.classList.contains("show-slots"));
  });

  fitView.addEventListener("click", () => {
    fitCanvasToShell();
  });

  zoomOut.addEventListener("click", () => {
    setCanvasZoom(canvasZoom - ZOOM_STEP);
  });

  zoomIn.addEventListener("click", () => {
    setCanvasZoom(canvasZoom + ZOOM_STEP);
  });

  zoomRange.addEventListener("input", (event) => {
    setCanvasZoom(Number(event.target.value) / 100);
  });

  canvas.closest(".canvas-shell").addEventListener(
    "wheel",
    (event) => {
      if (!event.ctrlKey && !event.metaKey) {
        return;
      }

      event.preventDefault();
      const zoomDirection = event.deltaY > 0 ? -1 : 1;
      const canvasRect = canvas.getBoundingClientRect();
      setCanvasZoom(canvasZoom + zoomDirection * ZOOM_STEP, true, {
        x: event.clientX - canvasRect.left,
        y: event.clientY - canvasRect.top
      });
    },
    { passive: false }
  );

  setSlotOutlinesVisible(false);
}

flipCharacter.addEventListener("click", () => {
  isCharacterFlipped = !isCharacterFlipped;
  updateVisibleSlotPositions();
  updateCharacterFlipControl();
  saveCharacterState();
});

exportPng.addEventListener("click", exportCurrentCanvasPng);
exportSvg.addEventListener("click", exportCurrentCanvasSvg);
initializeApp();

new ResizeObserver(() => fitCanvasToShell()).observe(canvas.closest(".canvas-shell"));
new ResizeObserver(updateFilmstripScrollbar).observe(optionFilmstrip);

function svg(viewBox, content) {
  return `<svg class="placeholder-art" viewBox="${viewBox}" aria-hidden="true">${content}</svg>`;
}

function assetArt(option, offset = { offsetX: 0, offsetY: 0 }) {
  if (!option.svgText) {
    return "";
  }

  return `
    <div
      class="asset-layer"
      style="left:${offset.offsetX}px; top:${offset.offsetY}px; width:${option.assetWidth}px; height:${option.assetHeight}px;"
      aria-hidden="true"
    >
      ${recolourSvg(option.svgText)}
    </div>
  `;
}

function recolourSvg(svgText) {
  const doc = new DOMParser().parseFromString(svgText, "image/svg+xml");
  const svg = doc.querySelector("svg");
  if (!svg) {
    return "";
  }

  svg.classList.add("asset-art");
  svg.removeAttribute("width");
  svg.removeAttribute("height");
  svg.removeAttribute("aria-hidden");
  svg.setAttribute("focusable", "false");

  [...svg.querySelectorAll("[id]")].forEach((element) => {
    const id = element.id.toLowerCase();
    const clothingLayerKey = getClothingLayerKey(element.id);

    if (id.includes("skin") || id.includes("background")) {
      recolourElementAndChildren(element, skinColour);
    } else if (clothingLayerKey) {
      recolourElementAndChildren(element, getClothingColour(clothingLayerKey));
    }
  });

  return svg.outerHTML;
}

function exportCurrentCanvasSvg() {
  const svgText = buildCurrentCanvasSvg();
  const blob = new Blob([svgText], { type: "image/svg+xml" });
  downloadBlob(blob, "character-1.svg");
}

async function exportCurrentCanvasPng() {
  const originalLabel = exportPng.textContent;
  exportPng.disabled = true;
  exportPng.textContent = "Exporting…";

  try {
    const svgBlob = new Blob([buildCurrentCanvasSvg()], { type: "image/svg+xml" });
    const sourceUrl = URL.createObjectURL(svgBlob);

    try {
      const image = await loadImage(sourceUrl);
      const outputCanvas = document.createElement("canvas");
      outputCanvas.width = EXPORT_SIZE;
      outputCanvas.height = EXPORT_SIZE;

      const context = outputCanvas.getContext("2d");
      if (!context) {
        throw new Error("PNG export is not supported by this browser.");
      }

      context.drawImage(image, 0, 0, outputCanvas.width, outputCanvas.height);

      const pngBlob = await canvasToBlob(outputCanvas, "image/png");
      downloadBlob(pngBlob, "character-1.png");
    } finally {
      URL.revokeObjectURL(sourceUrl);
    }
  } catch (error) {
    console.error("Unable to export PNG", error);
    window.alert("The PNG could not be exported. Please try again.");
  } finally {
    exportPng.disabled = false;
    exportPng.textContent = originalLabel;
  }
}

function loadImage(url) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("The exported SVG could not be rendered."));
    image.src = url;
  });
}

function canvasToBlob(sourceCanvas, type, quality) {
  return new Promise((resolve, reject) => {
    sourceCanvas.toBlob((blob) => {
      if (blob) {
        resolve(blob);
      } else {
        reject(new Error("The canvas could not be encoded as a PNG."));
      }
    }, type, quality);
  });
}

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 0);
}

function buildCurrentCanvasSvg() {
  const doc = document.implementation.createDocument("http://www.w3.org/2000/svg", "svg");
  const svgElement = doc.documentElement;
  const exportLayout = getExportLayout();
  const artworkGroup = doc.createElementNS("http://www.w3.org/2000/svg", "g");

  svgElement.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  svgElement.setAttribute("width", String(EXPORT_SIZE));
  svgElement.setAttribute("height", String(EXPORT_SIZE));
  svgElement.setAttribute("viewBox", `0 0 ${EXPORT_SIZE} ${EXPORT_SIZE}`);
  svgElement.setAttribute("role", "img");
  svgElement.setAttribute("aria-label", canvas.getAttribute("aria-label") || "Illustrated character");
  const exportTransform = `translate(${exportLayout.offsetX} ${exportLayout.offsetY}) scale(${exportLayout.scale})`;
  artworkGroup.setAttribute(
    "transform",
    isCharacterFlipped ? `translate(${EXPORT_SIZE} 0) scale(-1 1) ${exportTransform}` : exportTransform
  );

  parts
    .filter((part) => isPartVisible(part.id))
    .sort((left, right) => left.slot.z - right.slot.z)
    .forEach((part) => {
      const selectedOption = getSelectedOption(part);
      const layer = buildExportLayer(doc, part, selectedOption);

      if (layer) {
        artworkGroup.appendChild(layer);
      }
    });

  svgElement.appendChild(artworkGroup);

  return `<?xml version="1.0" encoding="UTF-8"?>\n${new XMLSerializer().serializeToString(svgElement)}\n`;
}

function getExportLayout() {
  const bounds = getExportArtworkBounds();
  const artworkWidth = Math.max(bounds.maxX - bounds.minX, 1);
  const artworkHeight = Math.max(bounds.maxY - bounds.minY, 1);
  const availableSize = EXPORT_SIZE - EXPORT_PADDING * 2;
  const scale = Math.min(availableSize / artworkWidth, availableSize / artworkHeight);
  const renderedWidth = artworkWidth * scale;
  const renderedHeight = artworkHeight * scale;

  return {
    scale,
    offsetX: (EXPORT_SIZE - renderedWidth) / 2 - bounds.minX * scale,
    offsetY: (EXPORT_SIZE - renderedHeight) / 2 - bounds.minY * scale
  };
}

function getExportArtworkBounds() {
  const visibleArtwork = parts
    .filter((part) => isPartVisible(part.id))
    .map((part) => ({ part, option: getSelectedOption(part) }))
    .filter(({ option }) => option.svgText);

  if (visibleArtwork.length === 0) {
    return { minX: 0, minY: 0, maxX: 1, maxY: 1 };
  }

  return visibleArtwork.reduce(
    (bounds, { part, option }) => {
      const offset = getEffectivePartOffset(part, option);
      const minX = part.slot.x + offset.offsetX;
      const minY = part.slot.y + offset.offsetY;
      const width = option.assetWidth || part.slot.width;
      const height = option.assetHeight || part.slot.height;

      bounds.minX = Math.min(bounds.minX, minX);
      bounds.minY = Math.min(bounds.minY, minY);
      bounds.maxX = Math.max(bounds.maxX, minX + width);
      bounds.maxY = Math.max(bounds.maxY, minY + height);
      return bounds;
    },
    { minX: Infinity, minY: Infinity, maxX: -Infinity, maxY: -Infinity }
  );
}

function buildExportLayer(doc, part, option) {
  if (!option.svgText) {
    return null;
  }

  const parsed = new DOMParser().parseFromString(recolourSvg(option.svgText), "image/svg+xml");
  const sourceSvg = parsed.querySelector("svg");
  if (!sourceSvg) {
    return null;
  }

  const layer = doc.createElementNS("http://www.w3.org/2000/svg", "svg");
  const viewBox = sourceSvg.getAttribute("viewBox");
  const offset = getEffectivePartOffset(part, option);
  const x = part.slot.x + offset.offsetX;
  const y = part.slot.y + offset.offsetY;

  layer.setAttribute("x", String(x));
  layer.setAttribute("y", String(y));
  layer.setAttribute("width", String(option.assetWidth));
  layer.setAttribute("height", String(option.assetHeight));
  layer.setAttribute("overflow", "visible");
  if (viewBox) {
    layer.setAttribute("viewBox", viewBox);
  }

  [...sourceSvg.childNodes].forEach((child) => {
    layer.appendChild(doc.importNode(child, true));
  });

  return layer;
}

function getClothingColour(layerKey) {
  if (!clothingColours[layerKey]) {
    clothingColours[layerKey] = DEFAULT_CLOTHING_COLOUR;
  }

  return clothingColours[layerKey];
}

function recolourElementAndChildren(element, colour) {
  const targets = [element, ...element.querySelectorAll("[fill]")];
  targets.forEach((target) => {
    if (target.getAttribute("fill") !== "none") {
      target.setAttribute("fill", colour);
    }
  });
}

function fitCanvasToShell() {
  const shell = canvas.closest(".canvas-shell");
  const { width: availableWidth, height: availableHeight } = getCanvasViewportSize(shell);
  const characterBounds = getCurrentCharacterBounds();
  const characterWidth = Math.max(characterBounds.maxX - characterBounds.minX, 1);
  const characterHeight = Math.max(characterBounds.maxY - characterBounds.minY, 1);
  const scale = Math.min(1, availableWidth / characterWidth, availableHeight / characterHeight);

  setCanvasZoom(scale, false);
  centerCharacterInShell(characterBounds, availableWidth, availableHeight);
}

function getCanvasViewportSize(shell) {
  const styles = getComputedStyle(shell);
  const horizontalPadding = parseFloat(styles.paddingLeft) + parseFloat(styles.paddingRight);
  const verticalPadding = parseFloat(styles.paddingTop) + parseFloat(styles.paddingBottom);

  return {
    width: Math.max(shell.clientWidth - horizontalPadding - 24, 1),
    height: Math.max(shell.clientHeight - verticalPadding - 24, 1)
  };
}

function getCurrentCharacterBounds() {
  const visibleParts = parts.filter((part) => isPartVisible(part.id));
  if (visibleParts.length === 0) {
    return {
      minX: layoutOffset.x,
      minY: layoutOffset.y,
      maxX: layoutOffset.x + canvasBounds.width,
      maxY: layoutOffset.y + canvasBounds.height
    };
  }

  return visibleParts.reduce(
    (acc, part) => {
      const bounds = getOptionBounds(part, getSelectedOption(part));
      acc.minX = Math.min(acc.minX, bounds.minX);
      acc.minY = Math.min(acc.minY, bounds.minY);
      acc.maxX = Math.max(acc.maxX, bounds.maxX);
      acc.maxY = Math.max(acc.maxY, bounds.maxY);
      return acc;
    },
    { minX: Infinity, minY: Infinity, maxX: -Infinity, maxY: -Infinity }
  );
}

function centerCharacterInShell(bounds, availableWidth, availableHeight) {
  const centerX = (bounds.minX + bounds.maxX) / 2 - layoutOffset.x;
  const centerY = (bounds.minY + bounds.maxY) / 2 - layoutOffset.y;

  characterOffset = {
    x: availableWidth / (2 * canvasZoom) - centerX,
    y: availableHeight / (2 * canvasZoom) - centerY
  };

  updateVisibleSlotPositions();
  updateCharacterNamePosition();
}

function setCanvasZoom(nextZoom, preserveCharacterCenter = true, zoomAnchor = null) {
  const previousZoom = canvasZoom;
  const nextCanvasZoom = clamp(nextZoom, MIN_ZOOM, MAX_ZOOM);
  const bounds = preserveCharacterCenter && !zoomAnchor ? getCurrentCharacterBounds() : null;
  const centerX = bounds ? (bounds.minX + bounds.maxX) / 2 - layoutOffset.x : 0;
  const centerY = bounds ? (bounds.minY + bounds.maxY) / 2 - layoutOffset.y : 0;
  const screenCenterX = (centerX + characterOffset.x) * previousZoom;
  const screenCenterY = (centerY + characterOffset.y) * previousZoom;

  canvasZoom = nextCanvasZoom;
  if (zoomAnchor && previousZoom > 0) {
    characterOffset = {
      x: characterOffset.x + zoomAnchor.x / canvasZoom - zoomAnchor.x / previousZoom,
      y: characterOffset.y + zoomAnchor.y / canvasZoom - zoomAnchor.y / previousZoom
    };
    updateVisibleSlotPositions();
    updateCharacterNamePosition();
  } else if (bounds && previousZoom > 0) {
    characterOffset = {
      x: screenCenterX / canvasZoom - centerX,
      y: screenCenterY / canvasZoom - centerY
    };
    updateVisibleSlotPositions();
    updateCharacterNamePosition();
  }

  canvas.style.transform = `scale(${canvasZoom})`;
  zoomRange.value = String(Math.round(canvasZoom * 100));
  zoomValue.textContent = `${Math.round(canvasZoom * 100)}%`;
}

function beginCharacterDrag(event, partId) {
  if (event.button !== 0) {
    return;
  }

  activePartId = partId;
  renderControls();
  canvas.querySelectorAll(".slot").forEach((slot) => {
    slot.classList.toggle("is-active", slot.dataset.part === partId);
  });
  event.preventDefault();

  dragState = {
    pointerId: event.pointerId,
    startX: event.clientX,
    startY: event.clientY,
    startOffset: { ...characterOffset },
    didDrag: false
  };

  event.currentTarget.classList.add("is-dragging");
  event.currentTarget.setPointerCapture(event.pointerId);
  event.currentTarget.addEventListener("pointermove", dragCharacter);
  event.currentTarget.addEventListener("pointerup", endCharacterDrag, { once: true });
  event.currentTarget.addEventListener("pointercancel", endCharacterDrag, { once: true });
}

function dragCharacter(event) {
  if (!dragState || event.pointerId !== dragState.pointerId) {
    return;
  }

  const deltaX = (event.clientX - dragState.startX) / canvasZoom;
  const deltaY = (event.clientY - dragState.startY) / canvasZoom;
  if (Math.hypot(deltaX, deltaY) > 2) {
    dragState.didDrag = true;
  }

  characterOffset = {
    x: dragState.startOffset.x + deltaX,
    y: dragState.startOffset.y + deltaY
  };
  updateVisibleSlotPositions();
  updateCharacterNamePosition();
}

function endCharacterDrag(event) {
  if (dragState?.didDrag) {
    suppressNextClick = true;
    window.setTimeout(() => {
      suppressNextClick = false;
    }, 0);
  }

  event.currentTarget.classList.remove("is-dragging");
  event.currentTarget.removeEventListener("pointermove", dragCharacter);
  dragState = null;
}

function updateVisibleSlotPositions() {
  canvas.querySelectorAll(".slot").forEach((slot) => {
    const part = parts.find((candidate) => candidate.id === slot.dataset.part);
    if (!part) {
      return;
    }

    positionSlot(slot, part);
    slot.style.top = `${part.slot.y - layoutOffset.y + characterOffset.y}px`;
  });
}

function positionSlot(slot, part) {
  const baseLeft = part.slot.x - layoutOffset.x;

  if (isCharacterFlipped) {
    const bounds = getCurrentCharacterBounds();
    const mirrorAxisX = (bounds.minX + bounds.maxX) / 2 - layoutOffset.x;
    slot.style.left = `${mirrorAxisX * 2 - baseLeft - part.slot.width + characterOffset.x}px`;
    slot.style.transform = "scaleX(-1)";
    return;
  }

  slot.style.left = `${baseLeft + characterOffset.x}px`;
  slot.style.transform = "";
}

function updateCharacterFlipControl() {
  flipCharacter.setAttribute("aria-pressed", String(isCharacterFlipped));
  flipCharacter.title = isCharacterFlipped ? "Restore character direction" : "Flip character horizontally";
  flipCharacter.setAttribute(
    "aria-label",
    isCharacterFlipped ? "Restore character direction" : "Flip character horizontally"
  );
}

function updateCharacterNamePosition() {
  const name = canvas.querySelector(".character-name");
  if (!name) {
    return;
  }
  name.style.left = `${STAGE_PADDING + characterOffset.x + 140}px`;
  name.style.top = `${STAGE_PADDING + characterOffset.y + 20}px`;
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

async function initializeApp() {
  await Promise.all([loadAllPartOptions(), loadDefaultCalibrationOverrides()]);
  restoreCharacterState();
  render();
  fitCanvasToShell();
}

async function loadDefaultCalibrationOverrides() {
  try {
    const response = await fetch("assets/parts/calibration.json", { cache: "no-store" });
    if (!response.ok) {
      throw new Error(`Calibration request failed with ${response.status}`);
    }
    defaultCalibrationOverrides = await response.json();
  } catch (error) {
    console.warn("Unable to load default calibration overrides.", error);
    defaultCalibrationOverrides = {};
  }
}

async function loadAllPartOptions() {
  let assetManifest = {};

  try {
    const response = await fetch(PART_ASSET_MANIFEST, { cache: "no-store" });
    if (!response.ok) {
      throw new Error(`Asset manifest request failed with ${response.status}`);
    }
    assetManifest = await response.json();
  } catch (error) {
    console.warn("Unable to load the asset manifest.", error);
  }

  await Promise.all(parts.map((part) => loadPartOptions(part, assetManifest)));
}

async function loadPartOptions(part, assetManifest) {
  const directory = PART_ASSET_DIRECTORIES[part.id];
  if (!directory) {
    return;
  }

  try {
    const files = assetManifest[part.id] || [];
    if (files.length === 0) {
      throw new Error(`No SVGs found for ${part.id}`);
    }

    const options = await Promise.all(
      files.map(async (fileName) => {
        const src = `${directory}${encodeURIComponent(fileName)}`;
        const label = formatAssetLabel(fileName);
        const svgMetadata = await fetchSvgMetadata(src, part.slot);
        const metadataKey = resolveMetadataLabel(part.id, label);
        const offsets = FIGMA_OFFSETS[part.id]?.[metadataKey] || { offsetX: 0, offsetY: 0 };

        return {
          label,
          src,
          svgText: svgMetadata.svgText,
          assetWidth: svgMetadata.width,
          assetHeight: svgMetadata.height,
          offsetX: offsets.offsetX || 0,
          offsetY: offsets.offsetY || 0
        };
      })
    );

    part.options = dedupeAssetOptions(options).sort((a, b) =>
      a.label.localeCompare(b.label, undefined, { sensitivity: "base", numeric: true })
    );

    const preferredLabel = DEFAULT_OPTION_LABELS[part.id];
    const preferredIndex = part.options.findIndex((option) => option.label === preferredLabel);
    selections[part.id] = preferredIndex >= 0 ? preferredIndex : 0;
  } catch (error) {
    console.warn(`Falling back to placeholder options for ${part.id}.`, error);
    part.options = [{ label: "None" }];
    selections[part.id] = 0;
  }
}

function dedupeAssetOptions(options) {
  const optionsByLabel = new Map();

  options.forEach((option) => {
    const labelKey = option.label.toLowerCase();
    const existingOption = optionsByLabel.get(labelKey);

    if (!existingOption || getClothingLayerKeys(option.svgText).length > getClothingLayerKeys(existingOption.svgText).length) {
      optionsByLabel.set(labelKey, option);
    }
  });

  return [...optionsByLabel.values()];
}

async function fetchSvgMetadata(src, fallbackSlot) {
  const response = await fetch(src, { cache: "no-store" });
  if (!response.ok) {
    return { svgText: "", width: fallbackSlot.width, height: fallbackSlot.height };
  }

  const svgText = await response.text();
  const doc = new DOMParser().parseFromString(svgText, "image/svg+xml");
  const svg = doc.querySelector("svg");
  if (!svg) {
    return { svgText, width: fallbackSlot.width, height: fallbackSlot.height };
  }

  const width = parseSvgDimension(svg.getAttribute("width"));
  const height = parseSvgDimension(svg.getAttribute("height"));

  if (width && height) {
    return { svgText, width, height };
  }

  const viewBox = (svg.getAttribute("viewBox") || "").trim().split(/\s+/).map(Number);
  if (viewBox.length === 4 && viewBox.every((value) => Number.isFinite(value))) {
    return { svgText, width: Math.ceil(viewBox[2]), height: Math.ceil(viewBox[3]) };
  }

  return { svgText, width: fallbackSlot.width, height: fallbackSlot.height };
}

function parseSvgDimension(value) {
  if (!value) {
    return null;
  }

  const match = value.match(/-?\d+(\.\d+)?/);
  return match ? Math.ceil(Number(match[0])) : null;
}

function resolveMetadataLabel(partId, label) {
  const aliasMap = PART_FILE_LABEL_ALIASES[partId] || {};
  const canonicalLabel = canonicalizeLabel(label);
  return aliasMap[canonicalLabel] || label;
}

function formatAssetLabel(fileName) {
  const baseName = fileName.replace(/\.svg$/i, "").replace(/[_-]+/g, " ").trim();
  return baseName.replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function canonicalizeLabel(value) {
  return value.toLowerCase().replace(/[_-]+/g, " ").replace(/\s+/g, " ").trim();
}

function headGlassesArt() {
  return svg("0 0 150 158", `
    <circle class="fill" cx="76" cy="84" r="43"/>
    <path class="ink" d="M39 80c3-37 22-58 59-48 25 7 35 31 25 57"/>
    <path class="ink" d="M41 81c4 31 22 48 50 45 16-2 28-11 34-26"/>
    <path class="ink" d="M58 87h25M96 87h25M83 87c4-5 9-5 13 0"/>
    <circle class="ink" cx="68" cy="88" r="13"/>
    <circle class="ink" cx="108" cy="88" r="13"/>
    <path class="ink" d="M83 99c6 5 13 5 19 0M88 108c7 8 17 7 24 0"/>
    <path class="ink" d="M47 62c14-39 76-40 83 2"/>
    <path d="M43 60c12-42 30-54 55-50 28 4 45 22 40 55-20-16-64-18-95-5Z"/>
    <circle cx="83" cy="17" r="18"/>
  `);
}

function headShortHairArt() {
  return svg("0 0 150 158", `
    <circle class="fill" cx="76" cy="84" r="42"/>
    <path d="M39 70c7-31 29-48 58-43 26 5 39 24 39 47-23-11-45-15-97-4Z"/>
    <path class="ink" d="M39 75c3-31 23-50 56-48 28 2 44 22 42 53"/>
    <path class="ink" d="M43 84c3 29 22 46 49 43 16-2 27-10 34-25"/>
    <circle class="ink" cx="65" cy="89" r="3"/>
    <circle class="ink" cx="108" cy="89" r="3"/>
    <path class="ink" d="M83 102c6 5 12 5 18 0"/>
  `);
}

function headChildArt() {
  return svg("0 0 150 158", `
    <circle class="fill" cx="75" cy="82" r="39"/>
    <path class="ink" d="M42 78c2-27 21-45 49-42 24 3 37 20 36 47"/>
    <path class="ink" d="M45 84c3 25 20 40 45 38 14-1 24-8 31-20"/>
    <path d="M44 68c10-34 35-47 66-32 13 6 22 18 24 35-16-11-48-16-90-3Z"/>
    <circle class="ink" cx="64" cy="86" r="3"/>
    <circle class="ink" cx="102" cy="86" r="3"/>
    <path class="ink" d="M77 102c8 6 17 6 25 0"/>
  `);
}

function bodyCollaredArt() {
  return svg("0 0 270 238", `
    <path class="fill" d="M60 78c34-32 112-32 149 0 16 45 25 96 24 145H34c0-50 8-99 26-145Z"/>
    <path class="ink" d="M60 78c34-32 112-32 149 0 16 45 25 96 24 145H34c0-50 8-99 26-145Z"/>
    <path class="ink" d="M102 49l35 49 32-50M136 98v125"/>
    <path class="ink" d="M82 66l34 24M187 66l-32 24"/>
    <path class="ink" d="M107 107l32 14 31-14"/>
  `);
}

function bodyJumperArt() {
  return svg("0 0 270 238", `
    <path class="fill" d="M55 79c42-31 116-31 158 0 19 59 24 113 21 144H31c-2-34 5-86 24-144Z"/>
    <path class="ink" d="M55 79c42-31 116-31 158 0 19 59 24 113 21 144H31c-2-34 5-86 24-144Z"/>
    <path class="ink" d="M108 48c9 17 42 17 51 0"/>
    <path class="ink" d="M90 214c40 8 79 8 119 0"/>
  `);
}

function bodyCardiganArt() {
  return svg("0 0 270 238", `
    <path class="fill" d="M58 76c43-30 112-30 154 0 18 54 25 111 23 147H32c-3-41 6-95 26-147Z"/>
    <path class="ink" d="M58 76c43-30 112-30 154 0 18 54 25 111 23 147H32c-3-41 6-95 26-147Z"/>
    <path class="ink" d="M96 55l38 63 43-63M134 118v105"/>
    <path class="ink" d="M156 125h18M156 153h18M156 181h18"/>
  `);
}

function rightArmTypingArt() {
  return svg("0 0 212 118", `
    <path class="fill" d="M12 18c40 18 50 58 80 64 30 6 63 4 99-4"/>
    <path class="ink" d="M12 18c40 18 50 58 80 64 30 6 63 4 99-4"/>
    <path class="ink" d="M118 79c9 11 26 15 44 9M162 89l19-4"/>
  `);
}

function rightArmPaperArt() {
  return svg("0 0 212 118", `
    <path class="ink" d="M16 16c32 23 41 54 71 61 18 4 33-3 44-21"/>
    <path class="ink" d="M127 53c10-6 22-7 34-1"/>
    <path class="ink" d="M152 12l45 10-10 51-44-11Z"/>
  `);
}

function rightArmSideArt() {
  return svg("0 0 212 118", `
    <path class="ink" d="M28 10c22 31 32 58 31 82"/>
    <path class="ink" d="M58 91c9 8 20 9 28 2M63 92l-4 15M72 95l1 15M82 94l5 13"/>
  `);
}

function leftArmLaptopArt() {
  return svg("0 0 154 134", `
    <path class="ink" d="M17 22c14 33 23 59 48 70 20 9 48 6 82-7"/>
    <path class="ink" d="M72 93c14 13 37 15 58 4"/>
  `);
}

function leftArmPointArt() {
  return svg("0 0 154 134", `
    <path class="ink" d="M20 17c24 34 39 54 69 60"/>
    <path class="ink" d="M88 77c16 0 28-6 39-19"/>
    <path class="ink" d="M127 58l23-1M118 65l20 15"/>
  `);
}

function leftArmRestArt() {
  return svg("0 0 154 134", `
    <path class="ink" d="M19 18c18 33 22 62 11 89"/>
    <path class="ink" d="M31 105c10 6 22 5 32-3"/>
  `);
}

function legsStraightArt() {
  return svg("0 0 248 248", `
    <path class="fill" d="M71 5h52l8 146c4 28-3 52-22 72H78c12-23 15-47 9-73Zm58 0h50l39 137c10 35 2 59-23 72h-31c5-26 0-51-16-76Z"/>
    <path class="ink" d="M71 5h52l8 146c4 28-3 52-22 72H78c12-23 15-47 9-73Zm58 0h50l39 137c10 35 2 59-23 72h-31c5-26 0-51-16-76Z"/>
    <path class="ink" d="M73 223c19 14 40 14 62 0M164 214c20 13 40 13 62 0"/>
  `);
}

function legsCrossedArt() {
  return svg("0 0 248 248", `
    <path class="fill" d="M76 10h54c16 49 38 92 65 128 12 16 9 33-8 51l-26 20c-11-45-43-82-96-113Zm72 0h42c9 56-2 109-34 159-15 22-32 28-52 17l-22-14c48-43 72-101 66-172Z"/>
    <path class="ink" d="M76 10h54c16 49 38 92 65 128 12 16 9 33-8 51l-26 20c-11-45-43-82-96-113Zm72 0h42c9 56-2 109-34 159-15 22-32 28-52 17l-22-14c48-43 72-101 66-172Z"/>
    <path class="ink" d="M158 209c23 18 46 15 70-8M74 173c17 18 38 20 62 8"/>
  `);
}

function standingLegsArt() {
  return svg("0 0 248 248", `
    <path class="fill" d="M65 6h58l-16 178c-2 21-11 34-27 39H43c10-18 16-38 18-60Zm72 0h57l24 163c5 21-3 36-23 45h-38c1-26-4-55-13-86Z"/>
    <path class="ink" d="M65 6h58l-16 178c-2 21-11 34-27 39H43c10-18 16-38 18-60Zm72 0h57l24 163c5 21-3 36-23 45h-38c1-26-4-55-13-86Z"/>
    <path class="ink" d="M44 223c22 12 46 12 70 0M157 214c22 14 46 13 72-2"/>
  `);
}

function laptopArt() {
  return svg("0 0 208 142", `
    <path class="shade" d="M43 17h126c8 0 14 6 14 14v80H58Z"/>
    <path class="ink" d="M43 17h126c8 0 14 6 14 14v80H58Z"/>
    <path class="ink" d="M14 112h187l-22 18H28Z"/>
  `);
}

function paperArt() {
  return svg("0 0 208 142", `
    <path class="fill" d="M72 12h83l-16 112H54Z"/>
    <path class="ink" d="M72 12h83l-16 112H54Z"/>
    <path class="ink" d="M78 45h84M72 70h76M68 94h70"/>
  `);
}

function deskArt() {
  return svg("0 0 560 318", `
    <path class="shade" d="M10 30h541v46H10Z"/>
    <path class="ink" d="M10 30h541v46H10ZM21 77l530-2M33 96h500"/>
    <path class="ink" d="M47 91v245M106 91v258M420 91v246M517 91v245"/>
    <path class="ink" d="M49 337h58M419 337h98M47 91h472"/>
  `);
}

function chairArt() {
  return svg("0 0 360 360", `
    <path class="shade" d="M65 30h154c21 0 34 13 34 34v111H88Z"/>
    <path class="ink" d="M65 30h154c21 0 34 13 34 34v111H88Z"/>
    <path class="ink" d="M102 190c66 36 132 35 198-4"/>
    <path class="ink" d="M180 207v93M115 321h130M180 300l-73 55M180 300l82 52"/>
    <circle class="ink" cx="96" cy="345" r="15"/>
    <circle class="ink" cx="276" cy="342" r="15"/>
  `);
}

function wheelchairArt() {
  return svg("0 0 360 360", `
    <path class="ink" d="M151 55h88v130H119"/>
    <path class="ink" d="M126 185h132l43 83"/>
    <circle class="ink" cx="121" cy="267" r="73"/>
    <circle class="ink" cx="292" cy="290" r="26"/>
    <path class="ink" d="M121 194v146M49 267h145M71 216l103 103M71 319l103-103"/>
  `);
}
