from flask_restful import abort


def try_convert(val):
    constructors = [int, str]
    for c in constructors:
        try:
            return c(val)
        except ValueError:
            pass


def create_error(status, message, extra=None):
    status_dict = {
        404: "Not Found",
        500: "Internal server error",
        400: "Bad request",
        403: "Forbidden",
        408: "Request timeout",
        418: "I'm a teapot"
    }
    if status == 418:
        message = "Server refuses the attempt to brew coffee with a teapot"
    if extra:
        abort(status, message=status_dict[status], error=message, additional_info=extra)
    else:
        abort(status, message=status_dict[status], error=message)