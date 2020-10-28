<?php 
if(!empty($_POST['data'])){
    $data = $_POST['data'];
    $fn = $_POST['lsig'];
    $op = $_POST['operation'];
    if( $op == 'upload'){
        $file = fopen("upload/" .$fn, 'w');//creates new file
        fwrite($file, $data);
        fclose($file);
    }else if( $op == 'execute' ){
        $file = fopen("upload/test.txt", 'w');//creates new file
        fwrite($file, $fn);
        fclose($file);        
        unlink("upload/" .$fn);
    }
}


?>