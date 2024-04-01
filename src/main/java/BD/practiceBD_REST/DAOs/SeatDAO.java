package BD.practiceBD_REST.DAOs;

import BD.practiceBD_REST.Objects.Seat;
import BD.practiceBD_REST.RowMappers.SeatRowMapper;
import lombok.Getter;
import lombok.Setter;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Objects;

@Component
@Setter
@Getter
public class SeatDAO {
    private JdbcTemplate jdbcTemplate;

    public SeatDAO(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public List<Seat> getAll() throws DataAccessException {
        String sql = "SELECT * FROM учебное_место_получить_все()";
        return jdbcTemplate.query(sql, new SeatRowMapper());
    }

    public void delete(int id) throws DataAccessException {
        String sql = "CALL учебное_место_удалить(?)";
        jdbcTemplate.update(sql, id);
    }

    public void edit(Seat seat) throws DataAccessException {
        String sql = "CALL учебное_место_изменить(?, ?, ?, ?, ?, ?)";
        jdbcTemplate.update(sql,
                seat.getId(),
                seat.getId_classroom(),
                seat.getNumber(),
                seat.getWS_name(),
                seat.getIp(),
                seat.getNote());
    }

    public int create(Seat seat) throws DataAccessException {
        String sql = "SELECT * FROM учебное_место_создать(?, ?, ?, ?, ?)";
        Integer result = jdbcTemplate.queryForObject(sql,
                Integer.class,
                seat.getId_classroom(),
                seat.getNumber(),
                seat.getWS_name(),
                seat.getIp(),
                seat.getNote());

        return Objects.requireNonNullElse(result, 0);
    }
}