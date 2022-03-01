#include <stdio.h>
int isPrime(int n){

    for (int i=2;i<=n/2; i++){
        if (!(n%i))return 0;
    }
    return 1;
}

int main() {
    int numPrimes=0;
    for (int i={{min}};i<{{max}}; i++)
    numPrimes += isPrime(i);

    printf("%d\n", numPrimes);
    return 0;
}