def try_convert(val):
    constructors = [int, str]
    for c in constructors:
        try:
            return c(val)
        except ValueError:
            pass