
As of writing this, I’m a SWE at Google, working on embedded, low-latency ML algorithms for the Pixel Watch series. This first blog — and really the reason I wanted to write blogs at all — is to build deeper contextual insight into the problem spaces I work on. Everything I write here are just my own inferences (*ha*) and thoughts derived from reading this whitepaper. This blog isn’t a source of truth — just a sandbox for me to process, reflect, and (hopefully) communicate ideas clearly. If I get something wrong, blame curiosity, not conviction. On with the review\!

A lot of the content in this paper rings true to me in many facets, and the importance of TinyML to me as a person that works on it in my day-to-day, truly cannot be overstated. There was a stat from Harvard in 2018 that said that we do not use 99% of all data collected from edge devices. That’s crazy, right? We have so much data floating around, and Big Data especially seems to really care about collecting massive swaths of it \-- but we don’t utilize the collected data nearly as much on these devices (trillions of them by the way) as much as we’d have hoped. 

## Introduction
### Constraints

TinyML, unlike traditional DL models, comes at a very low compute cost. Resource constrained environments (e.g an MCU) really need to be built with power consumption, compute cost and memory in mind. For example, MCUs have SRAM and they’re only about 250~350kB. The table from the paper says it nicely \-- “Microcontrollers have 3 orders of magnitude less memory and storage compared to mobile phones, and 5-6 orders of magnitude less than cloud GPUs” *(Lin et al, 2)*. This seems to stem from how optimization objectives are framed in traditional deep learning pipelines. Things like latency reduction/FLOPs/parameters get optimized but peak memory usage gets swept under the rug a bit as less-constrained environments typically do not need to worry about the peak memory usage (although it does look like the size has gotten smaller over the years). 

(Note: *The paper talks about "full model update schemes", which I didn't quite understand but apparently all it's trying to say is that **every param -- i.e weight and bias** in the entire model is updated during **each** step of training using the gradients computed through [back propagation](https://en.wikipedia.org/wiki/Backpropagation).*

*From that, we can understand that all **back propagation schemes** means is to develop alternative methods for computing these gradients and updating model params in a more memory-efficient and computationally feasible manner. Even conceptually, storing all those intermediate activations during the forward pass to compute gradients in the backward pass or computing such gradients for literally all params in the model are 100% going to be memory intensive.*)

### Co-design

The following portion on co-design makes sense as well. Optimizing on one front is good, but optimizing on all fronts is better -- that's the essence of the co-design principle that they illustrate. All Neural Networks that are optimized for a device go the other way as well in the sense that those devices have hardware components, system design, and training algorithms dedicated to fit the NN. 

There's more or less 4 parts to that:

1. **Neural network architectural improvements**

2. **Training algorithm design updates**

3. **Hardware Optimization**

4. **Framework Development**

By co-optimizing these components, researchers can create solutions that make TinyML feasible on resource-constrained devices, enabling applications like on-device learning, real-time inference, and low-power AI in edge environments.

(Note: "**co-design**" nowadays is a bit of a buzzword, especially in relation to Deep Learning or LLM. All sorts of co-designing has entered the space with some good and some bad. A good, recent example is the co-design paper written by the folks at [DeepSeek](https://www.alphaxiv.org/pdf/2408.14158), where they illustrate a co-design that's augmented towards DL and LLM in a cost-efficient manner. Subsequently, as of the time of writing this, DeepSeek is the number one most downloaded app, is cheaper to run than equivalent models (o1, Gemini Pro) and can be run locally without an internet connection.) 

### Recent Progress

This quote more or less sums up the problem set we have on an MCU: "In deep learning scenarios, SRAM limits the size
of activations (read and write) while flash memory limits the
size of the model (read-only)." *(Lin et al., 3)*. The former as stated before is somewhere in the ~300kB space and you only really get 1MB of flash memory as the paper agrees with. So how do we deal with that? The paper breaks solutions down into two categories — algorithmic and system-level — and I’ll try to unpack both.

1. *Algorithm Solutions*: \

The ones that I am most familiar with here were pruning & quantization. That is, the idea that there are layers of inefficiencies or bloat in existing networks and removing such redundancies help retain similar performance with less memory (and even reduced latency as a result of removing unnecessary layers or steps). [Tensor decomposition](https://arxiv.org/pdf/1711.10781) on the other hand needed an extra Google search from me -- and it turns out that it's a fairly popular compression technique as well, deserving of it's own deep dive. It's used to break down high-dimensional data (i.e tensors mainly 3D+) into more manageable components, often revealing latent structure and enabling dramatic storage and computation savings. It’s especially powerful in model compression (like neural networks) and multi-way data analysis, offering a structured way to preserve critical relationships while reducing redundancy. [Knowledge Distillation](https://neptune.ai/blog/knowledge-distillation) is another interesting form of model compression that I wasn't very clear on until researching it separately as well. In short, it’s about training a smaller “student” model to mimic a larger “teacher” model — learning not just from the labels but from the soft predictions the teacher outputs. This enables the student to internalize the teacher’s generalization behavior, often resulting in a surprisingly strong smaller model. The other alternative suggestion from the paper is funnily to make small NNs off the get-go, which is fair but I personally think is a bit infeasible in a real production setting. Even programmatically, you'd first write something that works then tweak to fit your usecase -- it's much rarer to write productionized software in one go. Making a model that's suboptimal, then compressing, tweaking, optimizing it is generally the accepted workflow in industry and is how you maintain pace matching with the other multitudes of working pieces that are simultaneously being built alongside yours. The counter is that making a small model from the get-go can easily be done and that it's as easily iterable -- which I’d say — sure, in theory. But in practice, designing small models from the start often requires a ton of upfront knowledge about the problem domain (even moreso than a large model), data distribution, and hardware constraints. And even then, you're likely to miss edge cases or under-optimize some part of the model until you have a working baseline to iterate on (which you'd already have much earlier by building a bigger model without those constraints). It’s kind of like trying to build the most efficient car engine before knowing if your car needs to drive uphill or off-road — you might get lucky, but more often you’ll end up revisiting design decisions anyway. That said, I do get the value of architecture-first approaches, especially when targeting very specific edge devices like wearables or microcontrollers. In those cases, hardware constraints are so tight that designing lean from the beginning makes more sense — but even then, I’d argue it's usually done after you’ve already proven your concept on a bigger, more flexible model.

More recently though, this design process has been somewhat automated using something called **Neural Architecture Search (NAS)**. I’ll be honest — this part is still a bit fuzzy to me, but from what I gathered, NAS is a method where machine learning is used to design machine learning models. It searches through different architecture configurations (like how many layers, what kinds of filters, etc.) to find the best-performing and most efficient model for a given task and hardware constraint. It’s definitely a rabbit hole I want to explore more in a future post (but I won't here because I'm realizing I'm reading more papers by trying to go through this one paper).

1. *System Solutions*:

TO BE CONTINUED...