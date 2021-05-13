#!/bin/sh

for d in */ ; do
    if [ $d != 'node_modules/' ] 
    then 
        cd $d
	    echo "$d"
	    git pull
	    cd ..
    fi	
done
