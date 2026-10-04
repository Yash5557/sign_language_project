import numpy as np
print("NumPy works successfully! Version:", np.__version__)
a = np.random.randn(10, 10)
b = np.dot(a, a.T)
print("Dot product computed successfully. Shape:", b.shape)
