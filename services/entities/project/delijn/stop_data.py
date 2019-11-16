import http.client
import json
import os

from typing import List

headers = {
    'Ocp-Apim-Subscription-Key': os.getenv("DE_LIJN_API_KEY")
}


def make_lijn_request(request_type, url, params=None):
    """
    Makes a request to the De Lijn API.
    :param request_type: The type of the request, usually 'GET'
    :param url: The url of the request
    :param params: The additional parameters of the request
    :return: a tuple of a json object and a HTTP status code
    """
    try:
        # Protection against stupid self
        if url[0] != '/':
            url = '/' + url

        # Create connection
        conn = http.client.HTTPSConnection('api.delijn.be')

        # Make request
        if params is None:
            conn.request(request_type, url, "{body}", headers)
        else:
            full_url = url + '?{}'.format(params)  # Format parameters
            conn.request(request_type, full_url, "{body}", headers)
        resp = conn.getresponse()
        status = int(resp.getcode())
        data = resp.read()
        conn.close()
        return json.loads(data), status
    except Exception as e:
        print("Error :'(", e.__str__())


def format_stop(raw_stop: dict) -> dict:
    formatted = dict()
    formatted['region'] = int(raw_stop.get('entiteitnummer'))
    formatted['number'] = int(raw_stop.get('haltenummer'))
    formatted['village'] = raw_stop.get('omschrijvingGemeente')
    formatted['name'] = raw_stop.get('omschrijving')
    return formatted


def convert(val):
    constructors = [int, str]
    for c in constructors:
        try:
            return c(val)
        except ValueError:
            pass


def get_stop_data(debug=True) -> List[dict]:
    if debug:
        result = list()
        d = dict()
        with open("./project/delijn/dummy-stops.txt") as f:
            for line in f:
                line = line.strip()
                if '{' == line:
                    d.clear()
                elif '}' == line:
                    result.append(d.copy())
                else:
                    contents = line.split(' ', 1)
                    d[''.join(contents[0].split())] = convert(''.join(contents[1].split()))

        return result
    try:
        raw_data = make_lijn_request("GET", "DLKernOpenData/api/v1/haltes")
        result = List[dict]
        for raw_stop in raw_data:
            result.append(format_stop(raw_stop))
        return result
    except Exception as e:
        raise e
