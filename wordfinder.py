"""Word Finder: finds random words from a dictionary."""
import random

class WordFinder:
    """Program to find words
    
    >>> wf = WordFinder("words.txt")
    
    """
    ...

    def __init__(self, path):
        """Initiates path and defines variables"""

        dict_file = open(path)

        self.words = self.parse(dict_file)

        print(f"{len(self.words)} words read")
    
    def parse(self, dict_file):
        """Parses all words and removes # spacing"""

        return [w.strip() for w in dict_file if w.strip() and not w.startswith("#")]

    # def read(self):
    #     """Opens file words.txt"""     
    #     file = open("/words.txt", "r")
    #     for line in file:
    #         print("line=", line)
    #     file.close()

    def random(self):
        """Returns random word from file"""
        return random.choice(self.words)
