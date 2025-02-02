There's always something difficult with writing information that'll last a longer time horizon. With that, I should preface that this is a paper written in early 2025, read by a person also in early 2025. DeepSeek has been taking the world by storm, and I wanted to know why and how. There's two papers on this that I'll read. This one, and the Incentivizing Reasoning Capability in LLMs one. Now, I personally can't wait to get started so let's go!

## Introduction

(*Note: Scaling laws are power laws used to describe how DL models scale. A circle and it's radius, if you will.*)

DeepSeek LLM is an open-source LLM that uses pre-training data of roughly 2 trillion tokens (with most being OpenAI response data) and what they refer to as a "long-term perspective" (Xiao et al, 2). They then use SFT and DPO on their base models to further increase the models accuracy and output. Allegedly in doing so, they've managed to create an open source variant equivalent or better than LLaMA-2 70B and GPT-3.5. Not necessarily a marvelous invention in an of itself, but it's worth noting that all these big companies hide their weights, params etc whereas you can even go as far as running DeepSeek locally on your own machine.

Their summary of what an LLM does might be useful to someone with no context into an LLM : *"By predicting the next word in continuous text, LLMs undergo self-supervised pre-training on massive datasets, enabling them to achieve various purposes and possess many abilities, such as novel creation, text summarization, code completion, and more."* (Xiao et al., 3)

They've also deliberately taken a step back in matching LLaMA benchmarks exclusively in a specific fixed-size model category, and have instead delved into the research of scaling laws, and thereby have found their own sense of an optimal mode/data scaling-up allocation strategy and the ability to predict expected performance of a large model -- which is relatively difficult to do, even now (hence why benchmarks are kind of the sole indicator of a good model right now). 

## Pre-Training

TO BE CONTINUED...






