package BD.practiceBD_REST.DAOs;

import BD.practiceBD_REST.Objects.Maintenance;
import BD.practiceBD_REST.RowMappers.MaintenanceRowMapper;
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
public class MaintenanceDAO {
    private JdbcTemplate jdbcTemplate;

    public MaintenanceDAO(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public List<Maintenance> getAll() throws DataAccessException{
        String sql = "SELECT * FROM обслуживание_получить_все()";
        return jdbcTemplate.query(sql, new MaintenanceRowMapper());
    }

    public void delete(int id) throws DataAccessException {
        String sql = "CALL обслуживание_удалить(?)";
        jdbcTemplate.update(sql, id);
    }

    public void edit(Maintenance maintenance) throws DataAccessException{
        String sql = "CALL обслуживание_изменить(?, ?, ?, ?, ?)";
        jdbcTemplate.update(sql,
                maintenance.getId(),
                maintenance.getId_seat(),
                maintenance.getId_equipment(),
                maintenance.getInstallation_date(),
                maintenance.getRemoval_date());
    }

    public int create(Maintenance maintenance) throws DataAccessException {
        String sql = "SELECT * FROM обслуживание_создать(?, ?, ?, ?)";
        Integer result = jdbcTemplate.queryForObject(sql,
                Integer.class,
                maintenance.getId_seat(),
                maintenance.getId_equipment(),
                maintenance.getInstallation_date(),
                maintenance.getRemoval_date());

        return Objects.requireNonNullElse(result, 0);
    }
}