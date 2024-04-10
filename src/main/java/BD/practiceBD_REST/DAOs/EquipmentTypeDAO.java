package BD.practiceBD_REST.DAOs;

import BD.practiceBD_REST.Objects.EquipmentType;
import BD.practiceBD_REST.RowMappers.EquipmentTypeRowMapper;
import lombok.Getter;
import lombok.Setter;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@Setter
@Getter
public class EquipmentTypeDAO {
    private JdbcTemplate jdbcTemplate;

    public EquipmentTypeDAO(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public List<EquipmentType> getAll() throws DataAccessException {
        String sql = "SELECT * FROM тип_оборудования_получить_все()";
        return jdbcTemplate.query(sql, new EquipmentTypeRowMapper());
    }

    public void delete(int id) throws DataAccessException {
        String sql = "CALL тип_оборудования_удалить(?)";
        jdbcTemplate.update(sql, id);
    }

    public void edit(EquipmentType equipmentType) throws DataAccessException {
        String sql = "CALL тип_оборудования_изменить(?, ?, ?, ?)";
        jdbcTemplate.update(sql,
                equipmentType.getId(),
                equipmentType.getCategory(),
                equipmentType.getName(),
                equipmentType.getCharacteristic());
    }

    public int create(EquipmentType equipmentType) throws DataAccessException {
        String sql = "SELECT * FROM тип_оборудования_создать(?, ?, ?)";
        Integer result = jdbcTemplate.queryForObject(sql,
                Integer.class,
                equipmentType.getCategory(),
                equipmentType.getName(),
                equipmentType.getCharacteristic());

        return java.util.Objects.requireNonNullElse(result, 0);
    }

    public int count() throws DataAccessException {
        String sql = "SELECT COUNT(*) FROM public.\"тип_оборудования\"";
        int count = jdbcTemplate.queryForObject(sql, Integer.class);
        return count;
    }
}