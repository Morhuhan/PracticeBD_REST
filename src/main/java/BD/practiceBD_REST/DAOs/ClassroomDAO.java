package BD.practiceBD_REST.DAOs;

import BD.practiceBD_REST.Objects.Classroom;
import BD.practiceBD_REST.RowMappers.ClassroomRowMapper;
import lombok.Getter;
import lombok.Setter;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@Setter
@Getter
public class ClassroomDAO {
    private JdbcTemplate jdbcTemplate;

    public ClassroomDAO(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public List<Classroom> getAll() throws DataAccessException {
        String sql = "SELECT * FROM класс_получить_все()";
        return jdbcTemplate.query(sql, new ClassroomRowMapper());
    }

    public void delete(int id) throws DataAccessException {
        String sql = "CALL класс_удалить(?)";
        jdbcTemplate.update(sql, id);
    }

    public void edit(Classroom classroom) throws DataAccessException {
        String sql = "CALL класс_изменить(?, ?, ?, ?, ?, ?)";
        jdbcTemplate.update(sql,
                classroom.getId(),
                classroom.getId_allocation(),
                classroom.getCurrent_num_of_places(),
                classroom.getMax_num_of_places(),
                classroom.getDepartment(),
                classroom.getNote());
    }

    public int create(Classroom classroom) throws DataAccessException {
        String sql = "SELECT * FROM класс_создать(?, ?, ?, ?, ?)";
        Integer result = jdbcTemplate.queryForObject(sql,
                Integer.class,
                classroom.getId_allocation(),
                classroom.getCurrent_num_of_places(),
                classroom.getMax_num_of_places(),
                classroom.getDepartment(),
                classroom.getNote());

        return java.util.Objects.requireNonNullElse(result, 0);
    }
}