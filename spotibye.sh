#!/bin/bash
# Clone spotify-export repo
#git clone git://github.com/jlund/spotify-export.git
# Make file pl_spot.txt containing the Spotify URLs
"${EDITOR:-nano}" pl_spot.txt

# save results
spotify-export/bin/spotify-export.rb pl_spot.txt | grep "[0-9]*\." | awk '{$1=""; print $0}' > pl_ta.txt

echo 'pl_ta.txt contains your playlist in the format Title -- Artist -- Album';
