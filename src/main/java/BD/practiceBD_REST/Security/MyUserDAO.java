package BD.practiceBD_REST.Security;

import lombok.Getter;
import lombok.Setter;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

@Component
@Setter
@Getter
public class MyUserDAO {

    private JdbcTemplate jdbcTemplate;

    public MyUserDAO(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public MyUser get(String username) throws DataAccessException {
        String sql = "SELECT * FROM получить_пользователя(?)";
        MyUser user = jdbcTemplate.queryForObject(sql, new MyUserRowMapper(), username);
        return user;
    }
}