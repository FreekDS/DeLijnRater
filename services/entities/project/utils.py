
def try_convert(val):
    """
    Tries to convert a value to an integer
    :param val: value to convert
    :return: integer form of val, or string form of val
    """
    constructors = [int, str]
    for c in constructors:
        try:
            return c(val)
        except ValueError:
            pass


def create_error(status, message, extra=None):
    """Creates an error message"""
    status_dict = {
        404: "Not Found",
        500: "Internal server error",
        400: "Bad request",
        403: "Forbidden or unauthorized",
        408: "Request timeout",
        418: "I'm a teapot",
    }
    if status == 418:
        message = "Server refuses the attempt to brew coffee with a teapot"

    if extra:
        return {
            "status": status,
            "message": status_dict[status],
            "error": message,
            "additional_information": extra
        }

    return {
        "status": status,
        "message": status_dict[status],
        "error": message
    }
