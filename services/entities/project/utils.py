from flask_restful import abort


def try_convert(val):
    constructors = [int, str]
    for c in constructors:
        try:
            return c(val)
        except ValueError:
            pass


# TODO update to better thingy
def create_error(status, message, extra=None):
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
            "additional information": extra
        }

    return {
        "status": status,
        "message": status_dict[status],
        "error": message
    }
