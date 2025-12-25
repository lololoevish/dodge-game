def get_min_max(lst):
    min_val = max_val = lst[0]
    for i in range(len(lst)):
        if lst[i] < min_val:
            min_val = lst[i]
        if lst[i] > max_val:
            max_val = lst[i]
    return(min_val, max_val)
arr = [100, -5, 0, 42, -100]        
print(get_min_max(arr))