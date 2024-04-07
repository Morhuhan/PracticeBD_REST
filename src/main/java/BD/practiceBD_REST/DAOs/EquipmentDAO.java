package BD.practiceBD_REST.DAOs;

import BD.practiceBD_REST.Objects.Equipment;
import BD.practiceBD_REST.Objects.Seat;
import BD.practiceBD_REST.RowMappers.EquipmentRowMapper;
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
public class EquipmentDAO {
    private JdbcTemplate jdbcTemplate;

    public EquipmentDAO(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public List<Equipment> getAll(int count, int page) throws DataAccessException {
        String sql = "SELECT * FROM оборудование_получить_все(?, ?)";
        return jdbcTemplate.query(sql, new EquipmentRowMapper(), count, page);
    }

    public int count() throws DataAccessException {
        String sql = "SELECT COUNT(*) FROM public.\"оборудование\"";
        int count = jdbcTemplate.queryForObject(sql, Integer.class);
        return count;
    }

    public void delete(int id) throws DataAccessException {
        String sql = "CALL оборудование_удалить(?)";
        jdbcTemplate.update(sql, id);
    }

    public void edit(Equipment equipment) throws DataAccessException {
        String sql = "CALL оборудование_изменить(?, ?, ?, ?, ?)";
        jdbcTemplate.update(sql,
                equipment.getId(),
                equipment.getId_equipmentType(),
                equipment.getInv_number(),
                equipment.getP_i(),
                equipment.getNote());
    }

    public int create(Equipment equipment) throws DataAccessException {
        String sql = "SELECT * FROM оборудование_создать(?, ?, ?, ?)";
        Integer result = jdbcTemplate.queryForObject(sql,
                Integer.class,
                equipment.getId_equipmentType(),
                equipment.getInv_number(),
                equipment.getP_i(),
                equipment.getNote());

        return Objects.requireNonNullElse(result, 0);
    }

    public List<Equipment> getListFaultyEquipment() throws DataAccessException {
        String sql = "SELECT * FROM request_получить_неиспр_обор()";
        return jdbcTemplate.query(sql, new EquipmentRowMapper());
    }
}