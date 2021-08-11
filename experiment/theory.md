We have learnt about Translation matrix T, Rotation matrices R and Scaling matrices S in our previous experiments. A sequence of these transforms can be represented using a composite matrix, say  

M = R<sub>x</sub>TR<sub>y</sub>ST

Operations are not commutative but are associative.

Translations are commutative: T<sub>1</sub>T<sub>2</sub> = T<sub>2</sub>T<sub>1</sub>

Scaling is commutative: S<sub>1</sub>S<sub>2</sub> = S<sub>2</sub>S<sub>1</sub>

Rotations are NOT commutative: R<sub>1</sub>R<sub>2</sub>  â  R<sub>2</sub>R<sub>1</sub>

Also RT  â  TR. Consider the following matrix representation.

<img src="images/rt-tr.png">

