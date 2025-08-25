import { app } from "../../scripts/app.js";

// Resolution configuration matching the Python code
const RESOLUTIONS = {
    "I2V720p": {
        "Horizontal": {"HQ": [1280, 720], "MQ": [832, 480], "LQ": [704, 544]},
        "Vertical": {"HQ": [720, 1280], "MQ": [480, 832], "LQ": [544, 704]},
        "Squarish": {"HQ": [624, 624], "MQ": [624, 624], "LQ": [624, 624]},
    },
    "I2V480p": {
        "Horizontal": {"HQ": [832, 480], "MQ": [704, 544], "LQ": [704, 544]},
        "Vertical": {"HQ": [480, 832], "MQ": [544, 704], "LQ": [544, 704]},
        "Squarish": {"HQ": [624, 624], "MQ": [624, 624], "LQ": [624, 624]},
    },
    "T2V14B": {
        "Horizontal": {"HQ": [1280, 720], "MQ": [1088, 832], "LQ": [832, 480]},
        "Vertical": {"HQ": [720, 1280], "MQ": [832, 1088], "LQ": [480, 832]},
        "Squarish": {"HQ": [960, 960], "MQ": [624, 624], "LQ": [544, 704]},
    },
    "T2V1.3B": {
        "Horizontal": {"HQ": [832, 480], "MQ": [704, 544], "LQ": [704, 544]},
        "Vertical": {"HQ": [480, 832], "MQ": [544, 704], "LQ": [544, 704]},
        "Squarish": {"HQ": [624, 624], "MQ": [624, 624], "LQ": [624, 624]},
    },
    "IMG": {
        "Horizontal": {"HQ": [1600, 900], "MQ": [1280, 720], "LQ": [1024, 576]},
        "Vertical": {"HQ": [900, 1600], "MQ": [720, 1280], "LQ": [576, 1024]},
        "Squarish": {"HQ": [1600, 1600], "MQ": [1024, 1024], "LQ": [512, 512]},
        "Cinematic": {"HQ": [1600, 688], "MQ": [1280, 550], "LQ": [1024, 440]},
    },
    "KONTEXT": {
        "Vertical": {"HQ": [672, 1568], "MQ": [720, 1456], "LQ": [832, 1248]},
        "Horizontal": {"HQ": [1568, 672], "MQ": [1456, 720], "LQ": [1248, 832]},
        "Squarish": {"HQ": [1024, 1024], "MQ": [944, 1104], "LQ": [880, 1184]},
    },
    "QWEN": {
        "Square": {"HQ": [1024, 1024], "MQ": [768, 768], "LQ": [512, 512]},
        "Landscape": {"HQ": [1280, 720], "MQ": [1024, 768], "LQ": [832, 624]},
        "Portrait": {"HQ": [720, 1280], "MQ": [768, 1024], "LQ": [624, 832]},
        "Wide": {"HQ": [1536, 768], "MQ": [1280, 640], "LQ": [1024, 512]},
        "Tall": {"HQ": [768, 1536], "MQ": [640, 1280], "LQ": [512, 1024]},
        "UltraWide": {"HQ": [1792, 768], "MQ": [1536, 640], "LQ": [1280, 544]},
        "UltraTall": {"HQ": [768, 1792], "MQ": [640, 1536], "LQ": [544, 1280]},
    },
};

app.registerExtension({
    name: "VideoResolutionSelector.DynamicFiltering",
    
    async beforeRegisterNodeDef(nodeType, nodeData, app) {
        if (nodeData.name === "VideoResolutionSelector") {
            const onNodeCreated = nodeType.prototype.onNodeCreated;
            
            nodeType.prototype.onNodeCreated = function() {
                if (onNodeCreated) {
                    onNodeCreated.apply(this, arguments);
                }
                
                this.updateAspectRatioOptions = () => {
                    const modeWidget = this.widgets.find(w => w.name === "mode");
                    const aspectRatioWidget = this.widgets.find(w => w.name === "aspect_ratio");
                    
                    if (modeWidget && aspectRatioWidget) {
                        const selectedMode = modeWidget.value;
                        const validAspectRatios = Object.keys(RESOLUTIONS[selectedMode] || {});
                        
                        // Store current value
                        const currentValue = aspectRatioWidget.value;
                        
                        // Update options
                        aspectRatioWidget.options.values = validAspectRatios;
                        
                        // Reset to first valid option if current value is not valid
                        if (!validAspectRatios.includes(currentValue)) {
                            aspectRatioWidget.value = validAspectRatios[0] || "Horizontal";
                        }
                        
                        // Force widget to update its display
                        this.setDirtyCanvas(true, true);
                    }
                };
                
                // Set up the mode widget callback
                const modeWidget = this.widgets.find(w => w.name === "mode");
                if (modeWidget) {
                    const originalCallback = modeWidget.callback;
                    modeWidget.callback = (value, graphCanvas, node, pos, event) => {
                        // Call original callback first
                        if (originalCallback) {
                            originalCallback.call(this, value, graphCanvas, node, pos, event);
                        }
                        
                        // Update aspect ratio options
                        this.updateAspectRatioOptions();
                    };
                }
                
                // Initialize aspect ratio options on creation
                this.updateAspectRatioOptions();
            };
        }
    }
});