package BD.practiceBD_REST.Objects;
import lombok.*;

@NoArgsConstructor
@AllArgsConstructor
@Setter
@Getter
@ToString
public class Equipment {

    private int id;

    private int id_equipmentType;

    private int inv_number;

    private Short p_i;

    private String note;
}
