from datetime import datetime
from diffusers import DiffusionPipeline, LCMScheduler
from diffusers.utils import logging
import torch

# Hide safety checker warning -- note: may need to disable for debugging
logging.set_verbosity_error()

# model_id = "Lykon/dreamshaper-8"
model_id = "Lykon/absolute-realism-1.81"
lcm_lora_id = "latent-consistency/lcm-lora-sdv1-5"

filename_prefix = "./images/customsd-"
file_type = ".png"

def setup_pipeline():
    pipeline = DiffusionPipeline.from_pretrained(
        model_id,
        safety_checker=None,
    )
    pipeline.scheduler = LCMScheduler.from_config(pipeline.scheduler.config)
    pipeline.to("cuda")

    pipeline.unet.to(memory_format=torch.channels_last)

    pipeline.load_lora_weights(lcm_lora_id)
    pipeline.fuse_lora()

    pipeline.enable_model_cpu_offload()

    # pipeline.vae.enable_tiling()
    # pipeline.vae.enable_slicing()

    return pipeline

def generate_image(pipeline, prompt, negative_prompt, width=512, height=512, steps=8, batch_count=1):
    for _ in range(batch_count):
        image = pipeline(
            prompt=prompt,
            negative_prompt=negative_prompt,
            guidance_scale=1.0,
            width=width, height=height, 
            num_inference_steps=steps,
        ).images[0]

        timestamp = datetime.now().strftime("%Y_%m_%d-%I_%M_%S_%p")
        filename = filename_prefix + timestamp + file_type
        image.save(filename)

    return filename

if __name__ == '__main__':
    pipeline = setup_pipeline()
    generate_image(pipeline, prompt="test", negative_prompt="bad quality")