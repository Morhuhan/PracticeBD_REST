package BD.practiceBD_REST.Objects;

import lombok.*;

@NoArgsConstructor
@AllArgsConstructor
@Setter
@Getter
@ToString
public class EquipmentType {

    private int id;

    private String category;

    private String name;

    private String characteristic;

}
