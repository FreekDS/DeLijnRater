from project.delijn.stop_data import make_lijn_request
from project.api.general import Region
from project.utils import try_convert

import click


def get_delijn_stopNumberByLine(region, line):
    """
    Makes a request to the API of de lijn to get all stops based on the line
    :param region: region of the line
    :param line: line number of the line
    :return: list of unformatted stops
    """
    try:
        region = region.value
        region = try_convert(region)
        line = try_convert(line)
        if type(region) is str:
            region = Region[region.upper()]
        raw_data, status = make_lijn_request("GET",
                                             "/DLKernOpenData/api/v1/lijnen/{}/{}/lijnrichtingen/HEEN/haltes".format(
                                                 str(region), str(line)))
        result = list()
        raw_data = raw_data.get("haltes")
        for data in raw_data:
            result.append(int(data.get("haltenummer")))
            pass
        return result
    except Exception as e:
        return []
