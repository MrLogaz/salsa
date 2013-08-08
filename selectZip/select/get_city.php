<?php
include_once 'connect.php';
$region_id = @intval($_GET['region_id']);
//$region_id = 4312;

$regs=mysql_query("SELECT name, city_id FROM city WHERE region_id=$region_id"); 

if ($regs) {
    $num = mysql_num_rows($regs);      
    $i = 0;
    while ($i < $num) {
       $citys[$i] = mysql_fetch_assoc($regs);   
       $i++;
    }     
    $result = array('citys'=>$citys);  
}
else {
	$result = array('type'=>'error');
}
/**
 * if ($regs) {
 * $num = mysql_num_rows($regs); 
 * $citys = array();

 * for ($i=0; $i<$num; $i++) 
 * $city[$i] = mysql_fetch_row($regs);

 * $i=0;
 * 	foreach ($city as $r) {
 * 		$citys[] = array('id'=>$i, 'title'=>$r);
 * 		$i++;
 * 	} 
 * $result = array('type'=>'success', 'citys'=>$citys);  
 * }
 * else {
 * 	$result = array('type'=>'error');
 * }
 */
//echo "<pre>";
//print_r ($result);
//echo "</pre>";
print json_encode($result); 
//print var_dump($result)
?>