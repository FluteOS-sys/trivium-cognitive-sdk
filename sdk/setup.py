from setuptools import setup, find_packages

with open("README.md", "r", encoding="utf-8") as fh:
    long_description = fh.read()

setup(
    name="trivium-cognitive-sdk",
    version="1.0.0",
    author="Trivium Team",
    author_email="team@trivium.dev",
    description="Cognitive Architecture SDK with 10 archetypal lenses for comprehensive text analysis",
    long_description=long_description,
    long_description_content_type="text/markdown",
    url="https://github.com/trivium/cognitive-sdk",
    packages=find_packages(),
    classifiers=[
        "Development Status :: 5 - Production/Stable",
        "Intended Audience :: Developers",
        "License :: OSI Approved :: MIT License",
        "Operating System :: OS Independent",
        "Programming Language :: Python :: 3",
        "Programming Language :: Python :: 3.8",
        "Programming Language :: Python :: 3.9",
        "Programming Language :: Python :: 3.10",
        "Programming Language :: Python :: 3.11",
        "Programming Language :: Python :: 3.12",
        "Topic :: Software Development :: Libraries :: Python Modules",
        "Topic :: Scientific/Engineering :: Artificial Intelligence",
        "Topic :: Text Processing :: Linguistic",
    ],
    python_requires=">=3.8",
    install_requires=[],
    extras_require={
        "dev": ["pytest", "black", "flake8"],
        "jupyter": ["ipython", "jupyter"],
    },
    keywords=[
        "cognitive", "architecture", "lens", "analysis", "archetypal", 
        "ai", "development", "code-review", "debugging", "nlp"
    ],
    project_urls={
        "Bug Reports": "https://github.com/trivium/cognitive-sdk/issues",
        "Source": "https://github.com/trivium/cognitive-sdk",
        "Documentation": "https://github.com/trivium/cognitive-sdk#readme",
    },
)