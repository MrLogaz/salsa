<?php
/******************************************************************************************
 * Эти файлы скачаны с сайта http://blog.gssl.ru и являются свободными в распространении.
 * Создай свой блог с системой управления контентом GSSL-Blog Free.
 ******************************************************************************************/
$host='localhost';          //Хост
$db='select1';               //Имя БД
$user_mysql='root';       //Имя пользователя БД
$pass_mysql='';          //Пароль пользователя БД
$link = mysql_connect($host, $user_mysql, $pass_mysql) or die("<center><h1>Don't connect with database!!!</h1></center>");
mysql_query ("set character_set_client='utf8'");
mysql_query ("set character_set_results='utf8'");
mysql_query ("set collation_connection='utf8_general_ci'");
mysql_select_db($db, $link)or die("<center><h1>ERROR CONNECT DATABASE!!!</h1></center>");
?>