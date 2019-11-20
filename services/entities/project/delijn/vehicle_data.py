from project.utils import try_convert
from typing import List


def get_vehicle_data(input=None) -> List[dict]:
    result = list()
    with open('./project/delijn/dummy-vehicles.txt') as f:
        d = dict()
        for line in f:
            line = line.strip()
            if line == '{':
                d.clear()
            elif line == '}':
                result.append(d.copy())
            else:
                contents = line.split(' ', 1)
                d[''.join(contents[0].split())] = try_convert(contents[1])
    return result


if __name__ == '__main__':
    get_vehicle_data("./dummy-vehicles.txt")
