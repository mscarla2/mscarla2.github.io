The reason why this is the first blog (and largely why I wanted to write blogs in general) is because I wanted to gain some contextual/deeper insight into the problem spaces that I work on. This blog isn’t meant to be a source of truth or knowledge base, so I apologize if I say things incorrectly. Everything I write here are just my own inferences (*ha*) and thoughts derived from reading this whitepaper. On with the review\!

### Intro

A lot of the content in this paper rings true to me in many faucets, and the importance of TinyML to me as a person that works on it in my day-to-day, truly cannot be overstated. There was a stat from Harvard in 2018 that said that we do not use 99% of all data collected from edge devices. That’s crazy, right? We have so much data floating around, and Big Data especially seems to really care about collecting massive suaves of it \-- but we don’t utilize the collected data nearly as much on these devices (trillions of them by the way) as much as we’d have hoped. 

### Constraints

TinyML, unlike traditional DL models, comes at a very low compute cost. Resource constrained environments (e.g an MCU) really need to be built with power consumption, compute cost and memory in mind. For example, MCUs have SRAM and they’re only about 256kB. The table from the paper says it nicely \-- “Microcontrollers have 3 orders of magnitude less memory and storage compared to mobile phones, and 5-6 orders of magnitude less than cloud GPUs” *(Lin et al, 2)*. A part of this from what I’m reading seems to be because of the focus of what an optimization problem might look like for an efficient DP ML model. Things like latency reduction/FLOPs/parameters get optimized but peak memory usage gets swept under the rug a bit as less-constrained environments typically do not need to worry about the peak memory usage (although it does look like the size has gotten smaller over the years). 

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


TO BE CONTINUED...