#!/bin/bash
# 上面中的 #! 是一种约定标记, 它可以告诉系统这个脚本需要什么样的解释器来执行;

# clear mbtiles
rm ./*.drc

# surport json and geojson
dir=`ls ./*.obj`

for file in $dir
do
	baseFileName=`basename $file .obj`
	filename=`basename $file`
	echo "file - " $filename
	draco_encoder -i ./$filename -o ./$baseFileName.drc
	echo "  "
done

echo "complete!"
