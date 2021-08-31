dir *.obj | select BaseName | foreach {
	$name = $_.BaseName

	Write-Host "start process layer $name"
	
	Invoke-Expression "& obj2gltf -i ./$name.obj -o ./$name.glb"

}
