<?php
function isPrime($n){

    for ($i=2;$i<=$n/2; $i++){
        if (!($n%$i))return 0;
    }
    return 1;
}

$numPrimes=0;
for ($i={{min}};$i<{{max}}; $i++)
$numPrimes += isPrime($i);

echo $numPrimes;

