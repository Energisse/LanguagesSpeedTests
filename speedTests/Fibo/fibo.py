nbr1=0
nbr2=1
n={{iteration}}
for i in range(n-3):
    if i <= 1:
        next = i
    else:
        next = nbr1 + nbr2
        nbr1 = nbr2
        nbr2 = next
