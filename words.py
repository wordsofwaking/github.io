def print_upper_words(words):
    """For a list of words, print out each word on a separate line, but in all uppercase. How can you change a word to uppercase? Ask Python for help on what you can do with strings!
    """

    for word in words:
        print(word.upper())


def print_upper_words_e(words):
    """Change that function so that it only prints words that start with the letter ‘e’ (either upper or lowercase).
    """

    for word in words:
        if word.startswith("e") or word.startswith("E"):
            print(word.upper())


def print_upper_words_letters(words, must_start_with):
    """Make your function more general: you should be able to pass in a set of letters, and it only prints words that start with one of those letters.
    """

    for word in words:
        for letter in must_start_with:
            if word.startswith(letter):
                print(word.upper())
                break