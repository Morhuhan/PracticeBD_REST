package BD.practiceBD_REST.DAOs;

import BD.practiceBD_REST.Objects.Allocation;
import BD.practiceBD_REST.RowMappers.AllocationRowMapper;
import lombok.Getter;
import lombok.Setter;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@Setter
@Getter
public class AllocationDAO {
    private JdbcTemplate jdbcTemplate;

    public AllocationDAO(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public List<Allocation> getAll() throws DataAccessException {
        String sql = "SELECT * FROM местоположение_получить_все()";
        return jdbcTemplate.query(sql, new AllocationRowMapper());
    }

    public void delete(int id) throws DataAccessException {
        String sql = "CALL местоположение_удалить(?)";
        jdbcTemplate.update(sql, id);
    }

    public void edit(Allocation allocation) throws DataAccessException {
        String sql = "CALL местоположение_изменить(?, ?, ?, ?, ?, ?)";
        jdbcTemplate.update(sql,
                allocation.getId(),
                allocation.getPref(),
                allocation.getStreet(),
                allocation.getHouse(),
                allocation.getRoom(),
                allocation.getPhone());
    }

    public int create(Allocation allocation) throws DataAccessException {
        String sql = "SELECT * FROM местоположение_создать(?, ?, ?, ?, ?)";
        Integer result = jdbcTemplate.queryForObject(sql,
                Integer.class,
                allocation.getPref(),
                allocation.getStreet(),
                allocation.getHouse(),
                allocation.getRoom(),
                allocation.getPhone());

        return java.util.Objects.requireNonNullElse(result, 0);
    }
}