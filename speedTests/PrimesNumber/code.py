def isPrime(n):
    for i in range(2,n//2+1):
        if (not (n%i)):
            return 0
    return 1

numPrimes=1

for i in range ({{min}},{{max}}):
  numPrimes+=isPrime(i)
print(str(numPrimes))