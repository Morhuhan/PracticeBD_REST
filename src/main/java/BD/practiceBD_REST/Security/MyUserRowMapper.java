package BD.practiceBD_REST.Security;

import org.springframework.jdbc.core.RowMapper;

import java.sql.ResultSet;
import java.sql.SQLException;

public class MyUserRowMapper implements RowMapper<MyUser> {
    @Override
    public MyUser mapRow(ResultSet rs, int rowNum) throws SQLException {
        MyUser user = new MyUser();
        user.setId(rs.getLong("ид"));
        user.setName(rs.getString("имя"));
        user.setPassword(rs.getString("пароль"));
        user.setRoles(rs.getString("роль"));
        return user;
    }
}
