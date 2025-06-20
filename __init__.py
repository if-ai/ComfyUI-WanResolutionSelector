class VideoResolutionSelector:
    """
    Selects appropriate video resolution based on mode, aspect ratio, and quality settings.
    Compatible with KJNodes image resize nodes.
    """
    
    # Resolution mappings based on mode, aspect ratio, and quality
    RESOLUTIONS = {
        "I2V720p": {
            "Horizontal": {
                "HQ": (1280, 720),
                "MQ": (832, 480),
                "LQ": (704, 544)
            },
            "Vertical": {
                "HQ": (720, 1280),
                "MQ": (480, 832),
                "LQ": (544, 704)
            },
            "Squarish": {
                "HQ": (624, 624),
                "MQ": (624, 624),
                "LQ": (624, 624)
            }
        },
        "I2V480p": {
            "Horizontal": {
                "HQ": (832, 480),
                "MQ": (704, 544),
                "LQ": (704, 544)
            },
            "Vertical": {
                "HQ": (480, 832),
                "MQ": (544, 704),
                "LQ": (544, 704)
            },
            "Squarish": {
                "HQ": (624, 624),
                "MQ": (624, 624),
                "LQ": (624, 624)
            }
        },
        "T2V14B": {
            "Horizontal": {
                "HQ": (1280, 720),
                "MQ": (1088, 832),
                "LQ": (832, 480)
            },
            "Vertical": {
                "HQ": (720, 1280),
                "MQ": (832, 1088),
                "LQ": (480, 832)
            },
            "Squarish": {
                "HQ": (960, 960),
                "MQ": (624, 624),
                "LQ": (544, 704)
            }
        },
        "T2V1.3B": {
            "Horizontal": {
                "HQ": (832, 480),
                "MQ": (704, 544),
                "LQ": (704, 544)
            },
            "Vertical": {
                "HQ": (480, 832),
                "MQ": (544, 704),
                "LQ": (544, 704)
            },
            "Squarish": {
                "HQ": (624, 624),
                "MQ": (624, 624),
                "LQ": (624, 624)
            }
        }
    }
    
    @classmethod
    def INPUT_TYPES(cls):
        return {
            "required": {
                "mode": (["I2V480p", "I2V720p", "T2V1.3B", "T2V14B"], {
                    "default": "I2V720p",
                    "tooltip": "Select the video generation mode"
                }),
                "aspect_ratio": (["Horizontal", "Vertical", "Squarish"], {
                    "default": "Horizontal",
                    "tooltip": "Select the aspect ratio orientation"
                }),
                "quality": (["HQ", "MQ", "LQ"], {
                    "default": "HQ",
                    "tooltip": "Select quality level - HQ: High Quality, MQ: Medium Quality, LQ: Low Quality"
                }),
            }
        }
    
    RETURN_TYPES = ("INT", "INT")
    RETURN_NAMES = ("width", "height")
    FUNCTION = "get_resolution"
    CATEGORY = "ImpactFrames💥🎞️/utils"
    
    DESCRIPTION = """
Automatically selects the appropriate width and height based on video generation mode,
aspect ratio, and quality settings. Compatible with KJNodes image resize nodes.

Modes:
- I2V480p: Image to Video 480p
- I2V720p: Image to Video 720p  
- T2V1.3B: Text to Video 1.3B model
- T2V14B: Text to Video 14B model

Aspect Ratios:
- Horizontal: Wider than tall (landscape)
- Vertical: Taller than wide (portrait)
- Squarish: Roughly square aspect ratio

Quality:
- HQ: Highest available resolution for the mode
- MQ: Medium quality/resolution
- LQ: Lower quality/resolution
"""
    
    def get_resolution(self, mode, aspect_ratio, quality):
        """
        Returns the width and height based on the selected parameters.
        
        Args:
            mode: The video generation mode
            aspect_ratio: The desired aspect ratio
            quality: The quality level
            
        Returns:
            tuple: (width, height)
        """
        try:
            width, height = self.RESOLUTIONS[mode][aspect_ratio][quality]
            return (width, height)
        except KeyError:
            # Fallback to a default resolution if something goes wrong
            print(f"Warning: Invalid combination of mode={mode}, aspect_ratio={aspect_ratio}, quality={quality}")
            print("Falling back to default resolution 832x480")
            return (832, 480)


# Node registration
NODE_CLASS_MAPPINGS = {
    "VideoResolutionSelector": VideoResolutionSelector,
}

NODE_DISPLAY_NAME_MAPPINGS = {
    "VideoResolutionSelector": "Video Resolution Selector 🎬",
} 