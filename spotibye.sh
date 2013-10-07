#!/bin/bash
# Clone spotify-export repo
git clone git://github.com/jlund/spotify-export.git
# Make file pl_spot.txt containing the Spotify URLs
"${EDITOR:-nano}" pl_spot.txt

# Seperate local and cloud files
sed "s/spotify/\\`echo -e '\n\rspotify'`/g" pl_spot.txt | grep ":track" > pl_spot_cloud.txt
sed "s/spotify/\\`echo -e '\n\rspotify'`/g" pl_spot.txt | grep ":local" > pl_spot_local.txt

# call spotify-export
until spotify-export/bin/spotify-export.rb pl_spot_cloud.txt; do true; done
# save results
spotify-export/bin/spotify-export.rb pl_spot_cloud.txt | awk '{$1=""; print $0}' > pl_ta.txt

echo 'pl_ta.txt contains your playlist in the format Title -- Artist -- Album';